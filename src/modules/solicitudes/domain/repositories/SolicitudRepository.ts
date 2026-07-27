import type {
  DashboardKpisResponse,
  RequestDetailByClientResponse,
  Solicitud,
  TrackingSolicitudResponse,
  SolicitudOrdenTrabajoResponse
} from '../models/Solicitud';

export interface SolicitudRepository {
  /**
   * Retrieves all expedientes/requests for a specific customer
   * @param clienteId Cédula or RUC of the client
   */
  getExpedientesByCliente(clienteId: string): Promise<Solicitud[]>;
  getTrackingByClienteId(
    clienteId: string
  ): Promise<TrackingSolicitudResponse[]>;
  getRequestDetailByRequestIdOrNumber(
    requestNumberOrId: string
  ): Promise<RequestDetailByClientResponse | null>;

  getTrackingBySolicitudId(
    solicitudId: string
  ): Promise<TrackingSolicitudResponse | null>;

  getOrdenesTrabajoBysSolicitudId(
    solicitudId: string
  ): Promise<SolicitudOrdenTrabajoResponse[]>;

  getDashboardKpisByClienteId(
    clienteId: string
  ): Promise<DashboardKpisResponse | null>;

  updateConnectionDocument(
    documentId: string,
    file: File,
    userId: string,
    requestId: string,
    documentTypeId: number
  ): Promise<boolean>;

  uploadInspectionInvoiceReceipt(
    invoiceId: string,
    file: File
  ): Promise<boolean>;

  submitCorrections(
    solicitudId: string,
    userId: string,
    files: File[],
    documentIds: string[]
  ): Promise<boolean>;
}
