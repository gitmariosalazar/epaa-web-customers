import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Clock, AlertTriangle } from 'lucide-react';
import { GetRequestDetailByRequestIdOrNumberUseCase } from '../../application/usecases/GetRequestDetailByRequestIdOrNumberUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import type {
  RequestDetailByClientResponse,
  TrackingSolicitudResponse
} from '../../domain/models/Solicitud';
import { SolicitudDocumentPreviewModal } from '../components/SolicitudDocumentPreviewModal';
import { SolicitudPhasePanel } from '../components/SolicitudPhasePanel';
import { SolicitudProgressBar } from '../components/SolicitudProgressBar';
import { GetTrackingBySolicitudIdUseCase } from '../../application/usecases/GetTrackingBySolicitudIdUseCase';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { UpdateConnectionDocumentUseCase } from '../../application/usecases/UpdateConnectionDocumentUseCase';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { UploadInspectionInvoiceReceiptUseCase } from '../../application/usecases/UploadInspectionInvoiceReceiptUseCase';

// Sub-components
import { SolicitudDetailHeader } from '../components/detail/SolicitudDetailHeader';
import { SolicitudDetailHeroCard } from '../components/detail/SolicitudDetailHeroCard';
import { SolicitudDetailPaymentCard } from '../components/detail/SolicitudDetailPaymentCard';
import { SolicitudDetailInfoCard } from '../components/detail/SolicitudDetailInfoCard';
import { SolicitudDetailDocumentsCard } from '../components/detail/SolicitudDetailDocumentsCard';
import { SolicitudDetailMetricsCard } from '../components/detail/SolicitudDetailMetricsCard';
import { SolicitudDetailTimelineCard } from '../components/detail/SolicitudDetailTimelineCard';

import './SolicitudDetailPage.css';

export const SolicitudDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] =
    useState<RequestDetailByClientResponse | null>(null);
  const [matchedTracking, setMatchedTracking] =
    useState<TrackingSolicitudResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { user } = useAuth();
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const requestDetailUseCase = React.useMemo(
    () =>
      new GetRequestDetailByRequestIdOrNumberUseCase(
        new SolicitudRepositoryImpl()
      ),
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
    () =>
      new UploadInspectionInvoiceReceiptUseCase(new SolicitudRepositoryImpl()),
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
      const success = await uploadReceiptUseCase.execute(
        solicitud.facturaId,
        file
      );

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
        err.message ||
        'Ocurrió un error inesperado al subir el comprobante de pago.'
      );
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleFileReplace = async (
    docId: string,
    file: File,
    documentTypeId: number
  ) => {
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
          setError(
            error.message || 'Error al cargar los detalles del expediente.'
          );
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

  return (
    <PageLayout
      header={
        <SolicitudDetailHeader
          solicitudNumero={solicitud.solicitudNumero}
          fechaSolicitud={solicitud.fechaSolicitud}
          onBack={() => navigate(-1)}
        />
      }
    >
      {/* ── Barra de progreso BPMN (ancho completo, sobre el grid) ── */}
      <SolicitudProgressBar estadoCodigo={solicitud.estado} />

      <div className="sol-detail-container">
        {/* ── COLUMNA IZQUIERDA: Detalles principales ── */}
        <div className="sol-detail-main-col">
          <SolicitudDetailHeroCard
            estado={solicitud.estado}
            diasEnProceso={solicitud.diasEnProceso}
            tipoAcometida={solicitud.tipoAcometida}
            updatedAt={solicitud.updatedAt}
          />

          <SolicitudDetailPaymentCard
            estado={solicitud.estado}
            isPaymentConfirmed={isPaymentConfirmed}
            numeroFactura={solicitud.numeroFactura}
            montofactura={solicitud.montofactura}
            isUploadingReceipt={isUploadingReceipt}
            onUploadReceipt={handleReceiptUpload}
          />

          {/* ── Panel contextual de fase (post-pago) ── */}
          <SolicitudPhasePanel solicitud={solicitud} />

          <SolicitudDetailInfoCard solicitud={solicitud} />

          <SolicitudDetailDocumentsCard
            documentos={solicitud.documentos}
            uploadingDocId={uploadingDocId}
            onFileReplace={handleFileReplace}
            onOpenViewer={() => setDocsOpen(true)}
          />
        </div>

        {/* ── COLUMNA DERECHA: Progreso y Seguimiento ── */}
        <div className="sol-detail-sidebar-col">
          <SolicitudDetailMetricsCard solicitud={solicitud} />

          <SolicitudDetailTimelineCard historial={matchedTracking?.historial} />
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
