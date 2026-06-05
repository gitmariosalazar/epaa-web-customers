import React from 'react';
import { FolderOpen, FileText, Upload, Clock } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';
import '../../styles/SolicitudDetailDocumentsCard.css';
import { SolicitudDocRow } from './SolicitudDocRow';

interface SolicitudDetailDocumentsCardProps {
  documentos: DocumentoAdjuntoResponse[];
  uploadingDocId: string | null;
  onFileReplace: (docId: string, file: File, documentTypeId: number) => void;
  onOpenViewer: (docId?: string) => void;
  setSelectedDocId: (docId: string) => void;
  setDocsOpen: (open: boolean) => void;
}

export const SolicitudDetailDocumentsCard: React.FC<
  SolicitudDetailDocumentsCardProps
> = ({
  documentos,
  uploadingDocId,
  onFileReplace,
  onOpenViewer,
  setSelectedDocId,
  setDocsOpen
}) => {
  const hasDocuments = documentos && documentos.length > 0;

  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <FileText size={18} className="sol-detail-card__title-icon" />
        <h3 className="sol-detail-card__title">
          Requisitos y Documentos Adjuntos
        </h3>
        {hasDocuments && (
          <Button
            variant="outline"
            size="compact"
            leftIcon={<FolderOpen size={14} />}
            onClick={() => onOpenViewer()}
            style={{ marginLeft: 'auto' }}
          >
            Visor Completo
          </Button>
        )}
      </div>

      {!hasDocuments ? (
        <div style={{ padding: '2rem' }}>
          <EmptyState
            message="No se encontraron documentos"
            description="No se encontraron documentos registrados para esta solicitud."
            icon={FileText}
            variant="info"
          />
        </div>
      ) : (
        <div className="sol-detail-docs-list">
          {documentos.map((doc) => {
            const isRejected =
              (doc.estadoValidacion || '').toUpperCase() === 'RECHAZADO' ||
              (doc.estadoValidacion || '').toUpperCase() === 'INVALIDO';

            return (
              <div
                key={doc.id}
                className="sol-detail-doc-row sol-detail-doc-row--interactive"
                onClick={() => onOpenViewer(doc.id)}
                title="Haz clic para abrir el visor en este documento"
              >
                <div className="sol-detail-doc-row__icon">
                  <FileText size={16} />
                </div>
                <div className="sol-detail-doc-row__info">
                  <SolicitudDocRow
                    key={doc.id}
                    doc={doc}
                    onClick={() => onOpenViewer(doc.id)}
                  />
                </div>
                <div
                  className="sol-detail-doc-row__badge"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.35rem'
                  }}
                >
                  <SolicitudDocRow
                    key={doc.id}
                    doc={doc}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setDocsOpen(true);
                    }}
                  />
                  {isRejected && (
                    <>
                      <button
                        type="button"
                        className="sol-detail-doc-row__upload-btn"
                        disabled={uploadingDocId === doc.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = document.getElementById(
                            `file-input-${doc.id}`
                          );
                          if (input) input.click();
                        }}
                      >
                        {uploadingDocId === doc.id ? (
                          <Clock
                            size={10}
                            className="sol-detail-loading__spinner"
                          />
                        ) : (
                          <Upload size={10} />
                        )}
                        {uploadingDocId === doc.id
                          ? 'Subiendo...'
                          : 'Subir Corrección'}
                      </button>
                      <input
                        type="file"
                        id={`file-input-${doc.id}`}
                        style={{ display: 'none' }}
                        accept=".pdf,image/*"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onFileReplace(
                              doc.id,
                              file,
                              Number(doc.tipodocumento)
                            );
                          }
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
