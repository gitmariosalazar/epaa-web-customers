import React from 'react';
import { FolderOpen, FileText, Upload, Clock } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { DocumentoAdjuntoResponse } from '../../../domain/models/Solicitud';
import '../../styles/SolicitudDetailDocumentsCard.css';
import { DOC_ESTADO_COLOR } from '@/shared/presentation/utils/colors/docs.colors';

const TIPO_DOC_LABEL: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano del Predio',
  3: 'Escritura Pública',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal',
  6: 'Certificado de No Adeudar',
  7: 'RUC / Nombramiento'
};

interface SolicitudDetailDocumentsCardProps {
  documentos: DocumentoAdjuntoResponse[];
  uploadingDocId: string | null;
  onFileReplace: (docId: string, file: File, documentTypeId: number) => void;
  onOpenViewer: (docId?: string) => void;
}

export const SolicitudDetailDocumentsCard: React.FC<
  SolicitudDetailDocumentsCardProps
> = ({ documentos, uploadingDocId, onFileReplace, onOpenViewer }) => {
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
            const docState =
              DOC_ESTADO_COLOR[doc.estadoValidacion] ??
              DOC_ESTADO_COLOR['PENDIENTE'];
            const docLabel =
              TIPO_DOC_LABEL[Number(doc.tipodocumento)] ??
              `Documento ${doc.tipodocumento}`;
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
                  <h4 className="sol-detail-doc-row__label">{docLabel}</h4>
                  <span className="sol-detail-doc-row__filename">
                    {`${docLabel} (${doc.id.slice(0, 8)})`}
                  </span>
                  {doc.observacion && (
                    <p className="sol-detail-doc-row__feedback">
                      <span style={{ fontWeight: 600 }}>Obs:</span>{' '}
                      {doc.observacion}
                    </p>
                  )}
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
                  <ColorChip
                    color={docState.color}
                    label={doc.estadoValidacion}
                    variant="soft"
                    size="xs"
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
