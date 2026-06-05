import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { getEstadoConfig, TIPO_ACOMETIDA_LABELS } from '../SolicitudConfig';
import '../../styles/SolicitudDetailHeroCard.css';

interface SolicitudDetailHeroCardProps {
  estado: string;
  diasEnProceso?: number;
  tipoAcometida: string;
  updatedAt?: string | Date;
}

export const SolicitudDetailHeroCard: React.FC<SolicitudDetailHeroCardProps> = ({
  estado,
  diasEnProceso = 0,
  tipoAcometida,
  updatedAt
}) => {
  const statusConfig = getEstadoConfig(estado);
  const tipoLabel = TIPO_ACOMETIDA_LABELS[tipoAcometida] ?? tipoAcometida;

  const updatedStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString('es-EC', {
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
        style={{ background: statusConfig.color }}
      />
      <div className="sol-detail-card__body sol-detail-card__body--hero">
        <div className="sol-detail-hero-status">
          <div
            className="sol-detail-hero-status__badge"
            style={{
              background: statusConfig.bg,
              color: statusConfig.color
            }}
          >
            {estado === 'aprobada' || estado === 'completada' ? (
              <CheckCircle size={24} />
            ) : estado === 'rechazada' ? (
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
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </h3>
          </div>
        </div>

        <div className="sol-detail-hero-stats">
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              Días en Proceso
            </span>
            <span className="sol-detail-hero-stat__value">
              {diasEnProceso}
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
      </div>
    </Card>
  );
};
