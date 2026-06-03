import type { Solicitud, TrackingSolicitudResponse } from '../models/Solicitud';

export interface SolicitudRepository {
  /**
   * Retrieves all expedientes/requests for a specific customer
   * @param clienteId Cédula or RUC of the client
   */
  getExpedientesByCliente(clienteId: string): Promise<Solicitud[]>;
  getTrackingByClienteId(clienteId: string): Promise<TrackingSolicitudResponse[]>;

}
