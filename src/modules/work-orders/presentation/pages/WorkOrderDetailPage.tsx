/**
 * WorkOrderDetailPage
 *
 * Carga la OT desde el parámetro de ruta `:codigoOrden`.
 * Vista de SOLO LECTURA con el detalle de la orden de trabajo.
 *
 * Clean Architecture — Presentation layer.
 */
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useAuth } from '@/shared/presentation/context/AuthContext';

// ── Use Cases ──────────────────────────────────────────────────────────────────
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// ── Domain types ───────────────────────────────────────────────────────────────
import type {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking
} from '../../domain/schemas/dto/response/work-orders.get.response';

// ── Sub-components ─────────────────────────────────────────────────────────────
import { WorkOrderHeroCard } from '../components/detail/WorkOrderHeroCard';
import { WorkOrderInfoCard } from '../components/detail/WorkOrderInfoCard';
import { WorkOrderMetricsCard } from '../components/detail/WorkOrderMetricsCard';
import { WorkOrderTimelineCard } from '../components/detail/WorkOrderTimelineCard';
import { WorkOrderMaterialsCard } from '../components/detail/WorkOrderMaterialsCard';
import { WorkOrderAttachmentsCard } from '../components/detail/WorkOrderAttachmentsCard';
import { WorkOrderQualityCard } from '../components/detail/WorkOrderQualityCard';
import { WorkOrderSatisfactionCard } from '../components/detail/WorkOrderSatisfactionCard';

// ── Icons ──────────────────────────────────────────────────────────────────────
import { ArrowLeft, Zap, AlertTriangle, Clock } from 'lucide-react';
import '../styles/WorkOrderDetailPage.css';

// ── Helpers ────────────────────────────────────────────────────────────────────
const ESTADOS_TERMINAL = new Set([
  'COMPLETADA',
  'CANCELADA',
  'INSTALACION_COMPLETADA',
  'INSPECCION_COMPLETADA'
]);

// ─────────────────────────────────────────────────────────────────────────────
export const WorkOrderDetailPage: React.FC = () => {
  const { codigoOrden = '' } = useParams<{ codigoOrden: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user)

  // ── Data state ──────────────────────────────────────────────────────────────
  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [tracking, setTracking] = useState<OrdenTrabajoTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // ── Repos & Use Cases ───────────────────────────────────────────────────────
  const repo = React.useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);

  const detalleUseCase = React.useMemo(
    () => new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repo),
    [repo]
  );
  const trackingUseCase = React.useMemo(
    () => new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repo),
    [repo]
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const reload = useCallback(() => setReloadTrigger((p) => p + 1), []);
  console.log(reload)

  // ── Load orden + tracking ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (!codigoOrden) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [det, trk] = await Promise.all([
          detalleUseCase.execute(codigoOrden),
          trackingUseCase.execute(codigoOrden)
        ]);
        if (isMounted) {
          setOrden(det);
          setTracking(trk);
        }
      } catch (e: any) {
        if (isMounted)
          setError(e.message || 'Error al cargar la orden de trabajo.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [codigoOrden, detalleUseCase, trackingUseCase, reloadTrigger]);

  // ── Formatted date ───────────────────────────────────────────────────────────
  const updatedStr = orden?.updatedAt
    ? new Date(orden.updatedAt).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '—';

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div className="wo-detail-loading">
          <Clock className="wo-detail-loading__spinner" size={24} />
          <span>Cargando orden de trabajo...</span>
        </div>
      </PageLayout>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────────
  if (error || !orden) {
    return (
      <PageLayout>
        <div className="wo-detail-error">
          <AlertTriangle
            size={48}
            style={{ color: 'var(--error)', opacity: 0.8 }}
          />
          <h3>Orden no encontrada</h3>
          <p>{error || 'No se pudo localizar la orden de trabajo.'}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Volver Atrás
          </Button>
        </div>
      </PageLayout>
    );
  }

  const isTerminal = ESTADOS_TERMINAL.has(orden.estado ?? '');

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <PageLayout
      header={
        <div className="wo-detail-header-nav">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <div className="wo-detail-header-nav__info">
            <h2 className="wo-detail-header-nav__title">
              Orden de Trabajo: {orden.codigoOrden}
            </h2>
            <span className="wo-detail-header-nav__subtitle">
              {orden.tipoTrabajo} · {orden.departamento}
            </span>
          </div>
        </div>
      }
    >
      <div className="wo-detail-container">
        {/* ══ COLUMNA PRINCIPAL ══ */}
        <div className="wo-detail-main-col">
          {/* Hero: estado + SLA + datos clave */}
          <WorkOrderHeroCard orden={orden} updatedStr={updatedStr} />

          {/* Estado final completado */}
          {isTerminal && orden.idEncuesta && (
            <div
              className="wo-process-info-banner wo-process-info-banner--success"
              style={{ marginBottom: '16px' }}
            >
              <Zap size={16} />
              <div>
                <strong>Proceso Completado ✓</strong>
                <span>
                  Encuesta de satisfacción registrada. La OT está cerrada.
                </span>
              </div>
            </div>
          )}

          {/* Info general */}
          <WorkOrderInfoCard orden={orden} />

          {/* Materiales y costos */}
          <WorkOrderMaterialsCard
            materiales={orden.materiales ?? []}
            costosAdicionales={orden.costosAdicionales ?? []}
          />

          {/* Adjuntos */}
          <WorkOrderAttachmentsCard
            adjuntos={orden.adjuntos ?? []}
          />

          {/* Control de calidad */}
          <WorkOrderQualityCard orden={orden} />

          {/* Encuesta de satisfacción */}
          <WorkOrderSatisfactionCard orden={orden} />
        </div>

        {/* ══ COLUMNA SIDEBAR ══ */}
        <div className="wo-detail-sidebar-col">
          <WorkOrderMetricsCard orden={orden} />
          <WorkOrderTimelineCard
            historial={tracking?.historial ?? null}
            title="Historial de Estados"
          />
        </div>
      </div>
    </PageLayout>
  );
};
