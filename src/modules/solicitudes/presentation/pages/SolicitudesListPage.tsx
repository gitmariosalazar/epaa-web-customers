// ============================================================
// PRESENTATION — SolicitudesListPage
// Uses the professional Table component with PDF export/preview.
// Clean Architecture: ExportService injected (DIP), Table does
// not know about ExportService, page orchestrates both (SRP).
// ============================================================

import React, { useState, useCallback } from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table } from '@/shared/presentation/components/Table/Table';
import type {
  Column,
  RowColor
} from '@/shared/presentation/components/Table/Table';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAssignmentAdd } from 'react-icons/md';

// ── Singleton export service (DIP) ──────────────────────────
const exportService = new ExportService();

import { MOCK_SOLICITUDES } from '../../infrastructure/data/SolicitudesMockData';
import type { Solicitud } from '../../domain/models/Solicitud';
import { 
  SolicitudesGlobalFilters, 
  defaultSolicitudesFilters
} from '../components/SolicitudesGlobalFilters';
import type { SolicitudesFilterState } from '../components/SolicitudesGlobalFilters';

// ── Status display config ─────────────────────────────────────
const ESTADO_CONFIG = {
  en_proceso: {
    label: 'En Proceso',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    icon: <Clock size={13} />
  },
  aprobada: {
    label: 'Aprobada',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    icon: <CheckCircle size={13} />
  },
  rechazada: {
    label: 'Rechazada',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    icon: <XCircle size={13} />
  },
  completada: {
    label: 'Completada',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    icon: <CheckCircle size={13} />
  }
};

// ── Available export columns ──────────────────────────────────
const AVAILABLE_COLUMNS: ExportColumn[] = [
  { id: 'id', label: 'N° Solicitud', isDefault: true },
  { id: 'titular', label: 'Titular', isDefault: true },
  { id: 'cedula', label: 'Cédula', isDefault: true },
  { id: 'categoria', label: 'Categoría', isDefault: true },
  { id: 'fechaCreacion', label: 'Fecha', isDefault: true },
  { id: 'estado', label: 'Estado', isDefault: true }
];

interface SolicitudesListPageProps {
  filter?: 'en_proceso' | 'aprobada' | 'rechazada' | 'completada';
  categoria?: string;
}

export const SolicitudesListPage: React.FC<SolicitudesListPageProps> = ({
  filter,
  categoria
}) => {
  const navigate = useNavigate();

  // ── PDF preview state ──────────────────────────────────────
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'landscape'
  );
  const [selectedColIds, setSelectedColIds] = useState<string[]>(
    AVAILABLE_COLUMNS.filter((c) => c.isDefault).map((c) => c.id)
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const { categoria: pathCategoria } = useParams<{ categoria: string }>();
  const activeCategoria = categoria || pathCategoria;

  const [filters, setFilters] = useState<SolicitudesFilterState>(defaultSolicitudesFilters);

  // ── Data ──────────────────────────────────────────────────
  let filtered = MOCK_SOLICITUDES;
  
  if (activeCategoria) {
    filtered = filtered.filter((s) => s.categoria === activeCategoria);
  }
  
  if (filter) {
    filtered = filtered.filter((s) => s.estado === filter);
  }

  // Apply new prototype filters
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((s) => 
      s.id.toLowerCase().includes(q) || 
      s.titular.toLowerCase().includes(q) || 
      s.cedula.includes(q) ||
      (s.detalles?.direccion && s.detalles.direccion.toLowerCase().includes(q))
    );
  }
  
  if (filters.userId) {
    filtered = filtered.filter((s) => 
      s.cedula.includes(filters.userId) || 
      s.titular.toLowerCase().includes(filters.userId.toLowerCase())
    );
  }
  
  if (filters.event) {
    filtered = filtered.filter((s) => s.estado === filters.event);
  }

  if (filters.initDate) {
    filtered = filtered.filter((s) => s.fechaCreacion >= filters.initDate);
  }

  if (filters.endDate) {
    filtered = filtered.filter((s) => s.fechaCreacion <= filters.endDate);
  }

  const handleFilterChange = (updates: Partial<SolicitudesFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const pageEventOptions = Object.keys(ESTADO_CONFIG).map(k => ({
    value: k,
    label: ESTADO_CONFIG[k as keyof typeof ESTADO_CONFIG].label
  }));

  const title = filter
    ? (ESTADO_CONFIG[filter as keyof typeof ESTADO_CONFIG]?.label ??
      'Solicitudes')
    : 'Mis Solicitudes';

  // ── Column definitions for Table component ─────────────────
  const columns: Column<Solicitud>[] = [
    {
      id: 'id',
      header: 'N° Solicitud',
      accessor: (sol) => (
        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
          {sol.id}
        </span>
      ),
      sortable: true,
      sortKey: 'id'
    },
    { id: 'titular', header: 'Titular', accessor: 'titular', sortable: true },
    { id: 'cedula', header: 'Cédula', accessor: 'cedula' },
    {
      id: 'categoria',
      header: 'Trámite',
      accessor: (sol) => <span style={{ textTransform: 'capitalize' }}>{sol.categoria.replace('_', ' ')}</span>,
      sortable: true
    },
    { id: 'fechaCreacion', header: 'Fecha', accessor: 'fechaCreacion', sortable: true },
    {
      id: 'estado',
      header: 'Estado',
      accessor: (sol) => {
        const cfg = ESTADO_CONFIG[sol.estado];
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: cfg.color,
              background: cfg.bg
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        );
      }
    },
    {
      id: 'acciones',
      header: 'Acciones',
      accessor: (sol) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={15} />}
          onClick={() => navigate(`/solicitudes/${sol.id}`)}
          id={`btn-ver-sol-${sol.id}`}
        >
          Ver
        </Button>
      )
    }
  ];

  // ── Row color by status ────────────────────────────────────
  const getRowColor = (sol: Solicitud): RowColor | undefined => {
    if (sol.estado === 'rechazada') return 'error';
    if (sol.estado === 'aprobada' || sol.estado === 'completada') return 'success';
    return undefined;
  };

  // ── PDF helpers ────────────────────────────────────────────
  const buildPdfOptions = useCallback(
    (colIds: string[], orient: 'portrait' | 'landscape') => {
      const colDefs = AVAILABLE_COLUMNS.filter((c) => colIds.includes(c.id));
      const headers = colDefs.map((c) => c.label);
      const rows = filtered.map((sol) =>
        colDefs.map((c) => {
          if (c.id === 'estado')
            return ESTADO_CONFIG[sol.estado as keyof typeof ESTADO_CONFIG]
              .label;
          return String(sol[c.id as keyof Solicitud] ?? '');
        })
      );
      return {
        fileName: `solicitudes_${new Date().toISOString().slice(0, 10)}`,
        title: `Reporte de ${title}`,
        columns: headers,
        rows,
        labelsHorizontal: {
          'Total de registros': String(filtered.length),
          'Generado por': 'Sistema EPAA-AA',
          Módulo: 'Nuevas Acometidas'
        },
        orientation: orient
      };
    },
    [filtered, title]
  );

  const handleApplyPreview = useCallback(() => {
    if (filtered.length === 0 || selectedColIds.length === 0) return;
    setLoadingPreview(true);
    setPreviewError(false);
    // Revoke previous URL via functional update (avoids stale closure)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    try {
      const url = exportService.generatePdfBlobUrl(
        buildPdfOptions(selectedColIds, orientation)
      );
      setPreviewUrl(url);
    } catch {
      setPreviewError(true);
    } finally {
      setLoadingPreview(false);
    }
  }, [buildPdfOptions, selectedColIds, orientation, filtered.length]);

  const handleDownload = useCallback(
    ({
      orientation: o,
      selectedColumnIds
    }: {
      orientation: 'portrait' | 'landscape';
      selectedColumnIds: string[];
    }) => {
      exportService.exportToPdf(buildPdfOptions(selectedColumnIds, o));
    },
    [buildPdfOptions]
  );

  const openPdfModal = () => {
    setPdfModalOpen(true);
    setPreviewUrl(null);
    setPreviewError(false);
  };

  // ── Auto-preview: generate immediately when modal opens ────
  React.useEffect(() => {
    if (!pdfModalOpen) return;
    handleApplyPreview();
  }, [pdfModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-preview: regenerate on column / orientation change
  //    (debounced 350ms so rapid toggling doesn't spam) ──────
  React.useEffect(() => {
    if (!pdfModalOpen) return;
    const timer = setTimeout(() => handleApplyPreview(), 350);
    return () => clearTimeout(timer);
  }, [selectedColIds, orientation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageLayout
        header={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              {title}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="primary"
                leftIcon={<MdAssignmentAdd size={18} />}
                onClick={() => navigate('/solicitudes/nueva')}
                id="btn-nueva-solicitud"
              >
                Nueva Solicitud
              </Button>
            </div>
          </div>
        }
        filters={
          <SolicitudesGlobalFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            eventOptions={pageEventOptions}
            onConsultar={() => console.log('Consultar con:', filters)}
          />
        }
      >
        <Table<Solicitud>
          data={filtered}
          columns={columns}
          pagination
          pageSize={10}
          fullHeight
          getRowColor={getRowColor}
          onExportPdf={openPdfModal}
          showColumnModal
          showTotalRecords
          showRowsPerPage
        />
      </PageLayout>

      {/* PDF Preview Modal */}
      <ReportPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => {
          setPdfModalOpen(false);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
        onDownload={handleDownload}
        onApply={handleApplyPreview}
        dataCount={filtered.length}
        reportTitle={title}
        availableColumns={AVAILABLE_COLUMNS}
        loadingPreview={loadingPreview}
        previewUrl={previewUrl}
        orientation={orientation}
        setOrientation={setOrientation}
        selectedColumnIds={selectedColIds}
        setSelectedColumnIds={setSelectedColIds}
        hasError={previewError}
      />
    </>
  );
};
