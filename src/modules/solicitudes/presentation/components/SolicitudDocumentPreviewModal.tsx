/**
 * SolicitudDocumentPreviewModal
 *
 * SRP: only handles document preview display.
 * DIP: receives document URL as prop — no knowledge of API internals.
 */
import React, { useState } from 'react';
import type { DocumentoAdjuntoResponse } from '../../domain/models/Solicitud';
import { environments } from '@/settings/environments/environments';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const API_BASE = (environments.API_URL || '').replace(/\/api$/, '').replace(/\/$/, '');

const TIPO_DOC_LABELS: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano / Croquis',
  3: 'Escritura / Título',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal'
};

const ESTADO_VALIDACION_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDIENTE:  { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <Clock size={12} /> },
  APROBADO:   { label: 'Aprobado',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: <CheckCircle size={12} /> },
  RECHAZADO:  { label: 'Rechazado', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: <AlertCircle size={12} /> }
};

interface SolicitudDocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentos: DocumentoAdjuntoResponse[];
  solicitudNumero: string;
}

export const SolicitudDocumentPreviewModal: React.FC<SolicitudDocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentos,
  solicitudNumero
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!isOpen || documentos.length === 0) return null;

  const doc = documentos[activeIdx];
  const docUrl = doc.url.startsWith('http') ? doc.url : `${API_BASE}${doc.url}`;
  const tipoLabel = TIPO_DOC_LABELS[Number(doc.tipodocumento)] ?? `Documento tipo ${doc.tipodocumento}`;
  const estadoVal = ESTADO_VALIDACION_CONFIG[doc.estadoValidacion] ?? ESTADO_VALIDACION_CONFIG['PENDIENTE'];
  const isPdf = docUrl.toLowerCase().endsWith('.pdf') || docUrl.includes('.pdf');

  return (
    <div
      className="doc-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Documentos de ${solicitudNumero}`}
    >
      <div className="doc-modal__panel">
        {/* ── Header ── */}
        <div className="doc-modal__header">
          <div className="doc-modal__header-left">
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span className="doc-modal__title">Documentos adjuntos</span>
              <span className="doc-modal__subtitle">{solicitudNumero}</span>
            </div>
          </div>
          <button className="doc-modal__close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="doc-modal__body">
          {/* ── Sidebar: document list ── */}
          <div className="doc-modal__sidebar">
            <p className="doc-modal__sidebar-title">
              {documentos.length} documento{documentos.length !== 1 ? 's' : ''}
            </p>
            {documentos.map((d, idx) => {
              const label = TIPO_DOC_LABELS[Number(d.tipodocumento)] ?? `Doc. ${idx + 1}`;
              const ev = ESTADO_VALIDACION_CONFIG[d.estadoValidacion] ?? ESTADO_VALIDACION_CONFIG['PENDIENTE'];
              return (
                <button
                  key={d.id}
                  className={`doc-modal__doc-item${idx === activeIdx ? ' doc-modal__doc-item--active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <FileText size={15} style={{ flexShrink: 0 }} />
                  <span className="doc-modal__doc-name">{label}</span>
                  <span
                    className="doc-modal__doc-estado"
                    style={{ color: ev.color, background: ev.bg }}
                  >
                    {ev.icon} {ev.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Preview area ── */}
          <div className="doc-modal__preview">
            {/* Metadata bar */}
            <div className="doc-modal__meta-bar">
              <span className="doc-modal__meta-tipo">{tipoLabel}</span>
              <span
                className="doc-modal__meta-estado"
                style={{ color: estadoVal.color, background: estadoVal.bg, border: `1px solid ${estadoVal.color}40` }}
              >
                {estadoVal.icon} {estadoVal.label}
              </span>
              {doc.observacion && (
                <span className="doc-modal__meta-obs">
                  <AlertCircle size={12} /> {doc.observacion}
                </span>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                <a
                  href={docUrl}
                  download
                  className="doc-modal__action-btn"
                  title="Descargar"
                >
                  <Download size={14} /> Descargar
                </a>
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-modal__action-btn"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink size={14} /> Abrir
                </a>
              </div>
            </div>

            {/* PDF / fallback */}
            <div className="doc-modal__viewer">
              {isPdf ? (
                <iframe
                  key={docUrl}
                  src={`${docUrl}#toolbar=1&navpanes=0`}
                  title={tipoLabel}
                  className="doc-modal__iframe"
                />
              ) : (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>Vista previa no disponible para este tipo de archivo.</p>
                  <a href={docUrl} target="_blank" rel="noopener noreferrer" className="doc-modal__action-btn">
                    <ExternalLink size={14} /> Ver archivo
                  </a>
                </div>
              )}
            </div>

            {/* Navigation arrows if multiple docs */}
            {documentos.length > 1 && (
              <div className="doc-modal__nav">
                <button
                  className="doc-modal__nav-btn"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx(i => i - 1)}
                  aria-label="Anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="doc-modal__nav-info">
                  {activeIdx + 1} / {documentos.length}
                </span>
                <button
                  className="doc-modal__nav-btn"
                  disabled={activeIdx === documentos.length - 1}
                  onClick={() => setActiveIdx(i => i + 1)}
                  aria-label="Siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
