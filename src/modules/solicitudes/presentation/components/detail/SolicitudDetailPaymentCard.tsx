import React from 'react';
import { CreditCard, Upload, Clock, CheckCircle } from 'lucide-react';
import './SolicitudDetailPaymentCard.css';

interface SolicitudDetailPaymentCardProps {
  estado: string;
  isPaymentConfirmed: boolean;
  numeroFactura?: string | null;
  montofactura?: number | null;
  isUploadingReceipt: boolean;
  onUploadReceipt: (file: File) => void;
}

export const SolicitudDetailPaymentCard: React.FC<SolicitudDetailPaymentCardProps> = ({
  estado,
  isPaymentConfirmed,
  numeroFactura,
  montofactura,
  isUploadingReceipt,
  onUploadReceipt
}) => {
  const displayMonto = montofactura ?? 0;
  if (estado === 'FACTURA_INSPECCION_EMITIDA') {
    return (
      <div className="sol-detail-payment-card">
        <div className="sol-detail-payment-card__header">
          <CreditCard
            size={20}
            className="sol-detail-payment-card__header-icon"
          />
          <div>
            <h3 className="sol-detail-payment-card__title">
              Pago de Tasa de Inspección
            </h3>
            <p className="sol-detail-payment-card__subtitle">
              Realice el pago de la inspección técnica del predio para
              continuar.
            </p>
          </div>
        </div>
        <div className="sol-detail-payment-card__body">
          <div className="sol-detail-payment-summary">
            <div className="sol-detail-payment-summary__label">
              <span className="sol-detail-payment-summary__title">
                Tasa de Inspección
              </span>
              {numeroFactura && (
                <span className="sol-detail-payment-summary__meta">
                  Factura: {numeroFactura}
                </span>
              )}
            </div>
            <span className="sol-detail-payment-summary__amount">
              ${displayMonto.toFixed(2)}
            </span>
          </div>

          <div className="sol-detail-payment-bank-details">
            <h4 className="sol-detail-payment-bank-details__title">
              Cuentas de Depósito / Transferencia
            </h4>
            <div className="sol-detail-payment-bank-grid">
              <div className="sol-detail-bank-account-card">
                <span className="sol-detail-bank-account-card__bank">
                  Banco del Austro
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>N° Cuenta:</strong> Corriente - 10203040
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>Beneficiario:</strong> EPAA GADM-AA
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>RUC:</strong> 1768153430001
                </span>
              </div>

              <div className="sol-detail-bank-account-card">
                <span className="sol-detail-bank-account-card__bank">
                  Banco Pichincha
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>N° Cuenta:</strong> Corriente - 2100123456
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>Beneficiario:</strong> EPAA GADM-AA
                </span>
                <span className="sol-detail-bank-account-card__item">
                  <strong>RUC:</strong> 1768153430001
                </span>
              </div>
            </div>
          </div>

          <div className="sol-detail-payment-upload">
            <label
              htmlFor="receipt-file-upload"
              className={`sol-detail-payment-upload-zone ${isUploadingReceipt ? 'sol-detail-payment-upload-zone--disabled' : ''}`}
            >
              <input
                type="file"
                id="receipt-file-upload"
                style={{ display: 'none' }}
                accept=".pdf,image/*"
                disabled={isUploadingReceipt}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadReceipt(file);
                  }
                }}
              />
              {isUploadingReceipt ? (
                <>
                  <Clock
                    size={32}
                    className="sol-detail-payment-upload-zone__icon sol-detail-loading__spinner"
                  />
                  <p className="sol-detail-payment-upload-zone__text">
                    Subiendo Comprobante...
                  </p>
                  <p className="sol-detail-payment-upload-zone__subtext">
                    Por favor espere mientras procesamos su archivo.
                  </p>
                </>
              ) : (
                <>
                  <Upload
                    size={32}
                    className="sol-detail-payment-upload-zone__icon"
                  />
                  <p className="sol-detail-payment-upload-zone__text">
                    Cargar Comprobante de Pago
                  </p>
                  <p className="sol-detail-payment-upload-zone__subtext">
                    Haga clic aquí para seleccionar una imagen o PDF
                    legible de su comprobante.
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (estado === 'PAGO_PENDIENTE') {
    return (
      <div className="sol-detail-payment-status-card sol-detail-payment-status-card--pending">
        <Clock
          size={20}
          className="sol-detail-payment-status-card__icon"
        />
        <div className="sol-detail-payment-status-card__body">
          <h4 className="sol-detail-payment-status-card__title">
            Pago en Proceso de Verificación
          </h4>
          <p className="sol-detail-payment-status-card__description">
            Comprobante en revisión. Nuestro personal de tesorería
            confirmará el pago en las próximas horas.
          </p>
        </div>
      </div>
    );
  }

  if (isPaymentConfirmed) {
    return (
      <div className="sol-detail-payment-status-card sol-detail-payment-status-card--confirmed">
        <CheckCircle
          size={20}
          className="sol-detail-payment-status-card__icon"
        />
        <div className="sol-detail-payment-status-card__body">
          <h4 className="sol-detail-payment-status-card__title">
            Pago Confirmado y Validado
          </h4>
          <p className="sol-detail-payment-status-card__description">
            Su pago de tasa de inspección ha sido verificado con éxito por
            el departamento de tesorería. El trámite continúa con
            normalidad.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
