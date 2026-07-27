import React from 'react';
import { FolderOpen, FileText, Upload, ClipboardList } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';
import '../../styles/SolicitudDetailDocumentsCard.css';
import { SolicitudDocRow } from './SolicitudDocRow';

interface SolicitudDocsCardProps {
  documentos: DocumentoAdjuntoResponse[];
  setDocsOpen: (open: boolean) => void;
  setSelectedDocId: (id: string) => void;
  onFileReplace?: (docId: string, file: File, documentTypeId: number) => void;
  uploadingDocId?: string | null;
  onBulkCorrectionsClick?: () => void;
  onOpenViewer?: (docId: string) => void;
}

export const SolicitudDetailDocumentsCard: React.FC<SolicitudDocsCardProps> = ({
  documentos,
  setDocsOpen,
  setSelectedDocId,
  onFileReplace,
  uploadingDocId,
  onBulkCorrectionsClick,
  onOpenViewer,
}) => {
  const hasDocs = documentos?.length > 0;
  const rejectedDocs = documentos?.filter(d => d.estadoValidacion === 'RECHAZADO' || d.estadoValidacion === 'INVALIDO') || [];
  const hasRejectedDocs = rejectedDocs.length > 0;

  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <ClipboardList size={18} className="sol-detail-card__title-icon" />
        <h3 className="sol-detail-card__title">
          Requisitos y Documentos Adjuntos
        </h3>
        {hasDocs && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            {hasRejectedDocs && onBulkCorrectionsClick && (
              <Button
                variant="primary"
                size="compact"
                leftIcon={<Upload size={14} />}
                onClick={onBulkCorrectionsClick}
              >
                Subir Documentos Rechazados
              </Button>
            )}
            <Button
              variant="outline"
              size="compact"
              leftIcon={<FolderOpen size={14} />}
              onClick={() => setDocsOpen(true)}
            >
              Visor Completo
            </Button>
          </div>
        )}
      </div>
      {!hasDocs ? (
        <div className="sol-detail-no-docs">
          <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No se encontraron documentos registrados para esta solicitud.</p>
        </div>
      ) : (
        <div className="sol-detail-docs-list">
          {documentos?.map((doc) => (
            <SolicitudDocRow
              key={doc.id}
              doc={doc}
              uploadingDocId={uploadingDocId}
              onFileReplace={onFileReplace}
              onClick={() => {
                if (onOpenViewer) onOpenViewer(doc.id);
                else {
                  setSelectedDocId(doc.id);
                  setDocsOpen(true);
                }
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
