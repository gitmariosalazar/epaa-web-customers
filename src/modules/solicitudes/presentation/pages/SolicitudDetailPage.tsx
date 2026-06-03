import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Card } from '@/shared/presentation/components/Card/Card';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { GetRequestDetailByRequestIdOrNumberUseCase } from '../../application/usecases/GetRequestDetailByRequestIdOrNumberUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import type { RequestDetailByClientResponse, TrackingSolicitudResponse } from '../../domain/models/Solicitud';
import { SolicitudDocumentPreviewModal } from '../components/SolicitudDocumentPreviewModal';
import {
  getEstadoConfig,
  TIPO_ACOMETIDA_LABELS,
  TIPO_PERSONA_LABELS,
  USO_PREDIO_LABELS
} from '../components/SolicitudConfig';
import { SolicitudPhasePanel } from '../components/SolicitudPhasePanel';
import { SolicitudProgressBar } from '../components/SolicitudProgressBar';
import {
  ArrowLeft,
  User,
  MapPin,
  FileText,
  Navigation,
  Info,
  Home,
  Building,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
  CreditCard,
  Gauge,
  ClipboardList,
  MessageSquare,
  AlertTriangle,
  FolderOpen,
  Activity,
  Upload
} from 'lucide-react';
import './SolicitudDetailPage.css';
import { GetTrackingBySolicitudIdUseCase } from '../../application/usecases/GetTrackingBySolicitudIdUseCase';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { UpdateConnectionDocumentUseCase } from '../../application/usecases/UpdateConnectionDocumentUseCase';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { UploadInspectionInvoiceReceiptUseCase } from '../../application/usecases/UploadInspectionInvoiceReceiptUseCase';

const DOC_ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  PENDIENTE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  APROBADO: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  VALIDO: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  RECHAZADO: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  INVALIDO: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  CORREGIDO: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' }
};

const TIPO_DOC_LABEL: Record<number | string, string> = {
  1: 'Cédula de Identidad',
  2: 'Plano del Predio',
  3: 'Escritura Pública',
  4: 'Formulario de Solicitud',
  5: 'Permiso Municipal',
  6: 'Certificado de No Adeudar',
  7: 'RUC / Nombramiento'
};

export const SolicitudDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<RequestDetailByClientResponse | null>(null);
  const [matchedTracking, setMatchedTracking] = useState<TrackingSolicitudResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { user } = useAuth();
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const requestDetailUseCase = React.useMemo(
    () => new GetRequestDetailByRequestIdOrNumberUseCase(new SolicitudRepositoryImpl()),
    []
  );
  const trackingUseCase = React.useMemo(
    () => new GetTrackingBySolicitudIdUseCase(new SolicitudRepositoryImpl()),
    []
  );
  const updateDocUseCase = React.useMemo(
    () => new UpdateConnectionDocumentUseCase(new SolicitudRepositoryImpl()),
    []
  );
  const uploadReceiptUseCase = React.useMemo(
    () => new UploadInspectionInvoiceReceiptUseCase(new SolicitudRepositoryImpl()),
    []
  );

  const handleReceiptUpload = async (file: File) => {
    if (!solicitud?.facturaId) {
      MessageToastCustom(
        'error',
        'Error de Facturación',
        'No se encontró el ID de la factura de inspección.'
      );
      return;
    }

    setIsUploadingReceipt(true);
    try {
      const success = await uploadReceiptUseCase.execute(solicitud.facturaId, file);

      if (success) {
        MessageToastCustom(
          'success',
          'Comprobante Cargado',
          'El comprobante ha sido subido correctamente. El estado se actualizará a Pago Pendiente.'
        );
        setReloadTrigger((prev) => prev + 1);
      } else {
        MessageToastCustom(
          'error',
          'Error',
          'No se pudo subir el comprobante. Inténtelo de nuevo.'
        );
      }
    } catch (err: any) {
      console.error('Error al subir comprobante de pago:', err);
      MessageToastCustom(
        'error',
        'Error al Subir',
        err.message || 'Ocurrió un error inesperado al subir el comprobante de pago.'
      );
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleFileReplace = async (docId: string, file: File, documentTypeId: number) => {
    if (!user?.userId) {
      MessageToastCustom(
        'error',
        'Error de Autenticación',
        'No se pudo determinar el usuario actual. Inicie sesión nuevamente.'
      );
      return;
    }
    if (!solicitud?.solicitudId) {
      MessageToastCustom(
        'error',
        'Error de Solicitud',
        'No se encontró el ID de la solicitud actual.'
      );
      return;
    }

    setUploadingDocId(docId);
    try {
      const success = await updateDocUseCase.execute(
        docId,
        file,
        user.userId,
        solicitud.solicitudId,
        documentTypeId
      );

      if (success) {
        MessageToastCustom(
          'success',
          'Documento Actualizado',
          'El documento ha sido cargado con éxito. Se ha enviado a validación.'
        );
        setReloadTrigger((prev) => prev + 1);
      } else {
        MessageToastCustom(
          'error',
          'Error',
          'No se pudo actualizar el documento. Inténtelo de nuevo.'
        );
      }
    } catch (err: any) {
      console.error('Error al subir el documento:', err);
      MessageToastCustom(
        'error',
        'Error',
        err.message || 'Ocurrió un error inesperado al subir el documento.'
      );
    } finally {
      setUploadingDocId(null);
    }
  };

  React.useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [solDetail, trackDetail] = await Promise.all([
          requestDetailUseCase.execute(id),
          trackingUseCase.execute(id)
        ]);

        if (isMounted) {
          setSolicitud(solDetail);
          setMatchedTracking(trackDetail);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error al cargar detalle de solicitud:', error);
        if (isMounted) {
          setError(error.message || 'Error al cargar los detalles del expediente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, requestDetailUseCase, trackingUseCase, reloadTrigger]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="sol-detail-loading">
          <Clock className="sol-detail-loading__spinner" size={24} />
          <span>Cargando expediente...</span>
        </div>
      </PageLayout>
    );
  }

  if (error || !solicitud) {
    return (
      <PageLayout>
        <div className="sol-detail-error">
          <AlertTriangle
            size={48}
            style={{ color: 'var(--error)', opacity: 0.8 }}
          />
          <h3>Expediente no encontrado</h3>
          <p>
            {error ||
              'No se pudo localizar la solicitud con el ID proporcionado o no tiene permisos para verla.'}
          </p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Volver Atrás
          </Button>
        </div>
      </PageLayout>
    );
  }

  const statusConfig = getEstadoConfig(solicitud.estado);
  const tipoLabel =
    TIPO_ACOMETIDA_LABELS[solicitud.tipoAcometida] ?? solicitud.tipoAcometida;
  const personaLabel =
    TIPO_PERSONA_LABELS[solicitud.tipoPersona] ?? solicitud.tipoPersona;
  const usoLabel =
    USO_PREDIO_LABELS[solicitud.usoPredio] ?? solicitud.usoPredio;

  const paymentConfirmedStates = [
    'PAGO_CONFIRMADO',
    'ORDEN_INSPECCION_EMITIDA',
    'INSPECCION_EN_PROCESO',
    'INFORME_EN_REVISION',
    'INFORME_APROBADO',
    'CONTRATO_GENERADO',
    'CONTRATO_FIRMADO',
    'OT_INSTALACION_EMITIDA',
    'INSTALACION_EN_PROCESO',
    'INSTALACION_COMPLETADA',
    'REGISTRO_CATASTRAL_PENDIENTE',
    'SUMINISTRO_ACTIVO'
  ];
  const isPaymentConfirmed = paymentConfirmedStates.includes(solicitud.estado);


  const fechaStr = solicitud.fechaSolicitud
    ? new Date(solicitud.fechaSolicitud).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  const updatedStr = solicitud.updatedAt
    ? new Date(solicitud.updatedAt).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  const isJuridica = solicitud.tipoPersona === 'JURIDICA';

  const titular = isJuridica
    ? (solicitud.company?.businessName || solicitud.datosAdicionales?.nombres || solicitud.clienteId)
    : (solicitud.person
        ? `${solicitud.person.firstName} ${solicitud.person.lastName}`
        : (solicitud.datosAdicionales?.nombres && solicitud.datosAdicionales?.apellidos
            ? `${solicitud.datosAdicionales.nombres} ${solicitud.datosAdicionales.apellidos}`
            : solicitud.clienteId));

  const identificationVal = isJuridica
    ? (solicitud.company?.ruc || solicitud.clienteId)
    : (solicitud.person?.personId || solicitud.clienteId);

  const emailVal = isJuridica
    ? (solicitud.company?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || '')
    : (solicitud.person?.emails?.[0]?.correo || solicitud.datosAdicionales?.email || '');

  const phoneVal = isJuridica
    ? (solicitud.company?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || '')
    : (solicitud.person?.phones?.[0]?.numero || solicitud.datosAdicionales?.telefono || '');

  return (
    <PageLayout
      header={
        <div className="sol-detail-header-nav">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <div className="sol-detail-header-nav__info">
            <h2 className="sol-detail-header-nav__title">
              Expediente: {solicitud.solicitudNumero}
            </h2>
            <span className="sol-detail-header-nav__subtitle">
              Creado el {fechaStr}
            </span>
          </div>
        </div>
      }
    >
      {/* ── Barra de progreso BPMN (ancho completo, sobre el grid) ── */}
      <SolicitudProgressBar estadoCodigo={solicitud.estado} />

      <div className="sol-detail-container">
        {/* ── COLUMNA IZQUIERDA: Detalles principales ── */}
        <div className="sol-detail-main-col">
          {/* Card 1: Resumen y Estado */}
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
                  {solicitud.estado === 'aprobada' ||
                  solicitud.estado === 'completada' ? (
                    <CheckCircle size={24} />
                  ) : solicitud.estado === 'rechazada' ? (
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
            </div>
          </Card>

          {solicitud.estado === 'FACTURA_INSPECCION_EMITIDA' && (
            <div className="sol-detail-payment-card">
              <div className="sol-detail-payment-card__header">
                <CreditCard size={20} className="sol-detail-payment-card__header-icon" />
                <div>
                  <h3 className="sol-detail-payment-card__title">Pago de Tasa de Inspección</h3>
                  <p className="sol-detail-payment-card__subtitle">
                    Realice el pago de la inspección técnica del predio para continuar.
                  </p>
                </div>
              </div>
              <div className="sol-detail-payment-card__body">
                <div className="sol-detail-payment-summary">
                  <div className="sol-detail-payment-summary__label">
                    <span className="sol-detail-payment-summary__title">Tasa de Inspección</span>
                    {solicitud.numeroFactura && (
                      <span className="sol-detail-payment-summary__meta">
                        Factura: {solicitud.numeroFactura}
                      </span>
                    )}
                  </div>
                  <span className="sol-detail-payment-summary__amount">
                    ${solicitud.montofactura ? solicitud.montofactura.toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="sol-detail-payment-bank-details">
                  <h4 className="sol-detail-payment-bank-details__title">Cuentas de Depósito / Transferencia</h4>
                  <div className="sol-detail-payment-bank-grid">
                    <div className="sol-detail-bank-account-card">
                      <span className="sol-detail-bank-account-card__bank">Banco del Austro</span>
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
                      <span className="sol-detail-bank-account-card__bank">Banco Pichincha</span>
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
                          handleReceiptUpload(file);
                        }
                      }}
                    />
                    {isUploadingReceipt ? (
                      <>
                        <Clock size={32} className="sol-detail-payment-upload-zone__icon sol-detail-loading__spinner" />
                        <p className="sol-detail-payment-upload-zone__text">Subiendo Comprobante...</p>
                        <p className="sol-detail-payment-upload-zone__subtext">Por favor espere mientras procesamos su archivo.</p>
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="sol-detail-payment-upload-zone__icon" />
                        <p className="sol-detail-payment-upload-zone__text">Cargar Comprobante de Pago</p>
                        <p className="sol-detail-payment-upload-zone__subtext">Haga clic aquí para seleccionar una imagen o PDF legible de su comprobante.</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {solicitud.estado === 'PAGO_PENDIENTE' && (
            <div className="sol-detail-payment-status-card sol-detail-payment-status-card--pending">
              <Clock size={20} className="sol-detail-payment-status-card__icon" />
              <div className="sol-detail-payment-status-card__body">
                <h4 className="sol-detail-payment-status-card__title">Pago en Proceso de Verificación</h4>
                <p className="sol-detail-payment-status-card__description">
                  Comprobante en revisión. Nuestro personal de tesorería confirmará el pago en las próximas horas.
                </p>
              </div>
            </div>
          )}

          {isPaymentConfirmed && (
            <div className="sol-detail-payment-status-card sol-detail-payment-status-card--confirmed">
              <CheckCircle size={20} className="sol-detail-payment-status-card__icon" />
              <div className="sol-detail-payment-status-card__body">
                <h4 className="sol-detail-payment-status-card__title">Pago Confirmado y Validado</h4>
                <p className="sol-detail-payment-status-card__description">
                  Su pago de tasa de inspección ha sido verificado con éxito por el departamento de tesorería. El trámite continúa con normalidad.
                </p>
              </div>
            </div>
          )}

          {/* ── Panel contextual de fase (post-pago) ── */}
          <SolicitudPhasePanel solicitud={solicitud} />

          {/* Card 2: Datos del Titular y Predio */}
          <Card className="sol-detail-card">
            <div className="sol-detail-card__title-row">
              <User size={18} className="sol-detail-card__title-icon" />
              <h3 className="sol-detail-card__title">Información General</h3>
            </div>

            <div className="sol-detail-grid">
              {/* Titular */}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">
                  Nombre del Titular
                </span>
                <span className="sol-detail-item__value">{titular}</span>
              </div>
              {/* Identificación */}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">
                  Identificación (Cédula / RUC)
                </span>
                <span className="sol-detail-item__value">
                  {identificationVal}
                </span>
              </div>
              {/* Email */}
              {emailVal && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label">
                    <Mail
                      size={12}
                      style={{ display: 'inline', marginRight: 4 }}
                    />{' '}
                    Correo Electrónico
                  </span>
                  <span className="sol-detail-item__value">
                    {emailVal}
                  </span>
                </div>
              )}
              {/* Teléfono */}
              {phoneVal && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label">
                    <Phone
                      size={12}
                      style={{ display: 'inline', marginRight: 4 }}
                    />{' '}
                    Teléfono
                  </span>
                  <span className="sol-detail-item__value">
                    {phoneVal}
                  </span>
                </div>
              )}
              {/* Persona */}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">
                  <Building
                    size={12}
                    style={{ display: 'inline', marginRight: 4 }}
                  />{' '}
                  Tipo de Persona
                </span>
                <span className="sol-detail-item__value">{personaLabel}</span>
              </div>
              {/* Uso de predio */}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">
                  <Home
                    size={12}
                    style={{ display: 'inline', marginRight: 4 }}
                  />{' '}
                  Uso del Predio
                </span>
                <span className="sol-detail-item__value">{usoLabel}</span>
              </div>
              {/* Dirección */}
              <div className="sol-detail-item sol-detail-item--full">
                <span className="sol-detail-item__label">
                  <MapPin
                    size={12}
                    style={{ display: 'inline', marginRight: 4 }}
                  />{' '}
                  Dirección
                </span>
                <span className="sol-detail-item__value">
                  {solicitud.direccion}
                </span>
              </div>
              {/* Clave catastral */}
              <div className="sol-detail-item">
                <span className="sol-detail-item__label">
                  <FileText
                    size={12}
                    style={{ display: 'inline', marginRight: 4 }}
                  />{' '}
                  Clave Catastral
                </span>
                <span className="sol-detail-item__value">
                  {solicitud.claveCatastral ?? '—'}
                </span>
              </div>
              {/* Coordenadas */}
              {solicitud.coordenadas && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label">
                    <Navigation
                      size={12}
                      style={{ display: 'inline', marginRight: 4 }}
                    />{' '}
                    Coordenadas
                  </span>
                  <span className="sol-detail-item__value">
                    {solicitud.coordenadas}
                  </span>
                </div>
              )}
              {/* Analista */}
              {solicitud.analistaUsername && (
                <div className="sol-detail-item">
                  <span className="sol-detail-item__label">
                    <User
                      size={12}
                      style={{ display: 'inline', marginRight: 4 }}
                    />{' '}
                    Analista Asignado
                  </span>
                  <span className="sol-detail-item__value">
                    {solicitud.analistaUsername}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Card 3: Documentos Adjuntos */}
          <Card className="sol-detail-card">
            <div className="sol-detail-card__title-row">
              <ClipboardList
                size={18}
                className="sol-detail-card__title-icon"
              />
              <h3 className="sol-detail-card__title">
                Requisitos y Documentos Adjuntos
              </h3>
              {solicitud.documentos?.length > 0 && (
                <Button
                  variant="outline"
                  size="compact"
                  leftIcon={<FolderOpen size={14} />}
                  onClick={() => setDocsOpen(true)}
                  style={{ marginLeft: 'auto' }}
                >
                  Visor Completo
                </Button>
              )}
            </div>

            {solicitud.documentos?.length === 0 ? (
              <div className="sol-detail-no-docs">
                <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>
                  No se encontraron documentos registrados para esta solicitud.
                </p>
              </div>
            ) : (
              <div className="sol-detail-docs-list">
                {solicitud.documentos.map((doc) => {
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
                    <div key={doc.id} className="sol-detail-doc-row">
                      <div className="sol-detail-doc-row__icon">
                        <FileText size={16} />
                      </div>
                      <div className="sol-detail-doc-row__info">
                        <h4 className="sol-detail-doc-row__label">
                          {docLabel}
                        </h4>
                        <span className="sol-detail-doc-row__filename">
                          {doc.url.split('/').pop()}
                        </span>
                        {doc.observacion && (
                          <p className="sol-detail-doc-row__feedback">
                            <span style={{ fontWeight: 600 }}>Obs:</span>{' '}
                            {doc.observacion}
                          </p>
                        )}
                      </div>
                      <div className="sol-detail-doc-row__badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
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
                              onClick={() => {
                                const input = document.getElementById(`file-input-${doc.id}`);
                                if (input) input.click();
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'transparent',
                                border: '1px solid var(--accent)',
                                color: 'var(--accent)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              {uploadingDocId === doc.id ? (
                                <Clock size={10} className="sol-detail-loading__spinner" />
                              ) : (
                                <Upload size={10} />
                              )}
                              {uploadingDocId === doc.id ? 'Subiendo...' : 'Subir Corrección'}
                            </button>
                            <input
                              type="file"
                              id={`file-input-${doc.id}`}
                              style={{ display: 'none' }}
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileReplace(doc.id, file, Number(doc.tipodocumento));
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
        </div>

        {/* ── COLUMNA DERECHA: Progreso y Seguimiento ── */}
        <div className="sol-detail-sidebar-col">
          {/* Card 4: Métricas del Proceso (Facturación, Medidor, Contrato) */}
          {(solicitud.numeroFactura ||
            solicitud.numeroContrato ||
            solicitud.numeroMedidor) && (
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
                {solicitud.numeroFactura && (
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
                {solicitud.numeroContrato && (
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
                {(solicitud.numeroCuenta || solicitud.numeroMedidor) && (
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
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Card 5: Timeline de Tracking */}
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

            {!matchedTracking || matchedTracking.historial?.length === 0 ? (
              <div className="sol-detail-no-timeline">
                <Clock size={24} style={{ opacity: 0.3, marginBottom: 6 }} />
                <p>
                  No se registran movimientos ni historial de seguimiento en
                  línea.
                </p>
              </div>
            ) : (
              <div className="sol-detail-timeline">
                {matchedTracking.historial.map((entry, idx) => (
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
        </div>
      </div>

      {/* ── Document Preview Modal ── */}
      {docsOpen && (
        <SolicitudDocumentPreviewModal
          isOpen={docsOpen}
          onClose={() => setDocsOpen(false)}
          documentos={solicitud.documentos}
          solicitudNumero={solicitud.solicitudNumero}
          solicitudId={solicitud.solicitudId}
          onValidationSuccess={() => setReloadTrigger((prev) => prev + 1)}
        />
      )}
    </PageLayout>
  );
};
