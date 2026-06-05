import React from 'react';
import { Info, CreditCard, FileCheck, Gauge } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';
import { ConnectionStateChip } from '@/shared/presentation/components/chip/ConnectionStateChip';
import '../../styles/SolicitudDetailMetricsCard.css';

interface SolicitudDetailMetricsCardProps {
  solicitud: RequestDetailByClientResponse;
}

export const SolicitudDetailMetricsCard: React.FC<SolicitudDetailMetricsCardProps> = ({
  solicitud
}) => {
  const hasInvoice = !!solicitud.numeroFactura;
  const hasContract = !!solicitud.numeroContrato;
  const hasMeterOrAccount = !!(
    solicitud.numeroCuenta ||
    solicitud.numeroMedidor ||
    solicitud.servicioActivo != null
  );

  if (!hasInvoice && !hasContract && !hasMeterOrAccount) {
    return null;
  }

  return (
    <Card className="sol-detail-card sol-detail-card--metrics">
      <div className="sol-detail-card__title-row">
        <Info size={16} className="sol-detail-card__title-icon" />
        <h3
          className="sol-detail-card__title"
          style={{ fontSize: '0.875rem' }}
        >
          Detalles del Servicio
        </h3>
      </div>

      <div className="sol-detail-metrics-list">
        {/* Factura */}
        {hasInvoice && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.1)'
              }}
            >
              <CreditCard size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Inspección & Pago
              </span>
              <span className="sol-detail-metric-item__value">
                Factura: {solicitud.numeroFactura}
              </span>
              {solicitud.montofactura && (
                <span className="sol-detail-metric-item__meta">
                  Monto: ${solicitud.montofactura.toFixed(2)} (
                  {solicitud.estadoPago ?? 'Pendiente'})
                </span>
              )}
            </div>
          </div>
        )}
        {/* Contrato */}
        {hasContract && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#8b5cf6',
                background: 'rgba(139,92,246,0.1)'
              }}
            >
              <FileCheck size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Contrato Registrado
              </span>
              <span className="sol-detail-metric-item__value">
                Contrato N°: {solicitud.numeroContrato}
              </span>
              {solicitud.estadoFirma && (
                <span className="sol-detail-metric-item__meta">
                  Firma: {solicitud.estadoFirma}
                </span>
              )}
            </div>
          </div>
        )}
        {/* Cuenta y Medidor */}
        {hasMeterOrAccount && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#10b981',
                background: 'rgba(16,185,129,0.1)'
              }}
            >
              <Gauge size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Medidor e Instalación
              </span>
              {solicitud.numeroMedidor && (
                <span className="sol-detail-metric-item__value">
                  Medidor N°: {solicitud.numeroMedidor}
                </span>
              )}
              {solicitud.numeroCuenta && (
                <span className="sol-detail-metric-item__meta">
                  Cuenta N°: {solicitud.numeroCuenta}
                </span>
              )}
              {solicitud.servicioActivo != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                  <span className="sol-detail-metric-item__meta" style={{ margin: 0 }}>Estado:</span>
                  <ConnectionStateChip
                    statusName={solicitud.servicioActivo ? 'ACTIVA' : 'NUEVA_PENDIENTE'}
                    size="xs"
                    variant="soft"
                    showTooltip={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
