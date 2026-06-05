import React from 'react';
import { Activity, MessageSquare, Clock } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { HistorialTrackingEntry } from '../../../domain/models/Solicitud';
import '../../styles/SolicitudDetailTimelineCard.css';

interface SolicitudDetailTimelineCardProps {
  historial?: HistorialTrackingEntry[];
}

export const SolicitudDetailTimelineCard: React.FC<SolicitudDetailTimelineCardProps> = ({
  historial
}) => {
  const hasHistorial = historial && historial.length > 0;

  return (
    <Card className="sol-detail-card sol-detail-card--timeline">
      <div className="sol-detail-card__title-row">
        <Activity size={16} className="sol-detail-card__title-icon" />
        <h3
          className="sol-detail-card__title"
          style={{ fontSize: '0.875rem' }}
        >
          Línea de Tiempo (Seguimiento)
        </h3>
      </div>

      {!hasHistorial ? (
        <div style={{ padding: '2rem' }}>
          <EmptyState
            message="Sin historial de seguimiento"
            description="No se registran movimientos ni historial de seguimiento en línea."
            icon={Clock}
            variant="info"
          />
        </div>
      ) : (
        <div className="sol-detail-timeline">
          {historial.map((entry, idx) => (
            <div key={idx} className="sol-detail-timeline-node">
              <div className="sol-detail-timeline-node__line" />
              <div className="sol-detail-timeline-node__dot" />
              <div className="sol-detail-timeline-node__content">
                <span className="sol-detail-timeline-node__date">
                  {new Date(entry.fecha).toLocaleDateString('es-EC', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <h4 className="sol-detail-timeline-node__title">
                  {entry.estadoLabel}
                </h4>
                {entry.comentario && (
                  <div className="sol-detail-timeline-node__comment">
                    <MessageSquare
                      size={10}
                      style={{
                        marginRight: 4,
                        flexShrink: 0,
                        marginTop: 2
                      }}
                    />
                    <p>{entry.comentario}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
