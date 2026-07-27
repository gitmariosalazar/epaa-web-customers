import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { getEstadoConfig, TIPO_ACOMETIDA_LABELS } from '../SolicitudConfig';
import '../../styles/SolicitudDetailHeroCard.css';

import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { Alert } from '@/shared/presentation/components/Alert';

interface SolicitudDetailHeroCardProps {
  solicitud: RequestDetailByClientResponse;
}

export const SolicitudDetailHeroCard: React.FC<SolicitudDetailHeroCardProps> = ({
  solicitud
}) => {
  const statusConfig = getEstadoConfig(solicitud.estado);
  const tipoLabel = TIPO_ACOMETIDA_LABELS[solicitud.tipoAcometida] ?? solicitud.tipoAcometida;

  const lastHistory = solicitud.historial[solicitud.historial.length - 1];

  console.log(lastHistory);

  const colorRejection = getEstadoConfig('RECHAZADA_TECNICA');

  const updatedStr = solicitud.updatedAt
    ? new Date(solicitud.updatedAt).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '—';

  return (
    <Card className="sol-detail-card sol-detail-card--hero">
      <div
        className="sol-detail-card__header-accent"
        style={{ background: lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? colorRejection.color : statusConfig.color }}
      />
      <div className="sol-detail-card__body sol-detail-card__body--hero">
        <div className="sol-detail-hero-status">
          <div
            className="sol-detail-hero-status__badge"
            style={{
              background: lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? colorRejection.bg : statusConfig.bg,
              color: lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? colorRejection.color : statusConfig.color
            }}
          >
            {solicitud.estado === 'aprobada' || solicitud.estado === 'completada' ? (
              <CheckCircle size={24} />
            ) : solicitud.estado === 'rechazada' || lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? (
              <XCircle size={24} />
            ) : (
              <Clock size={24} />
            )}
          </div>
          <div>
            <div className="sol-detail-hero-status__label">
              Estado Actual
            </div>
            <h3
              className="sol-detail-hero-status__value"
              style={{ color: lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? colorRejection.color : statusConfig.color }}
            >
              {lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? 'Pago Rechazado' : statusConfig.label}
            </h3>
          </div>
        </div>

        <div className="sol-detail-hero-stats">
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              Días en Proceso
            </span>
            <span className="sol-detail-hero-stat__value">
              {solicitud.diasEnProceso ?? 0}
            </span>
          </div>
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              Tipo Trámite
            </span>
            <span className="sol-detail-hero-stat__value">
              {tipoLabel}
            </span>
          </div>
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              Última Actualización
            </span>
            <span
              className="sol-detail-hero-stat__value"
              style={{ fontSize: '0.8rem' }}
            >
              {updatedStr}
            </span>
          </div>

        </div>
        {lastHistory?.comentario && (
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              {lastHistory?.comentario?.includes('Rechazada') ? 'Razón' : 'Observación'}
            </span>
            {lastHistory?.comentario?.includes('Comprobante de pago rechazado') ? (
              <Alert message={lastHistory.comentario} title='Motivo del Rechazo' type='error' dismissible={false} />
            ) : (
              <div
                className="sol-detail-hero-stat__value"
                style={{ fontSize: '0.8rem' }}
              >
                {lastHistory.comentario.split('|').map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            )
            }
          </div>
        )}
      </div>
    </Card>
  );
};
