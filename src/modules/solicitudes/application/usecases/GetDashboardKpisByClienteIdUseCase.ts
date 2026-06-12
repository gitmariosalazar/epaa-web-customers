import type { DashboardKpisResponse } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class GetDashboardKpisByClienteIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(clienteId: string): Promise<DashboardKpisResponse | null> {
    if (!clienteId) {
      throw new Error('El ID del cliente es requerido');
    }
    return await this.solicitudRepository.getDashboardKpisByClienteId(
      clienteId
    );
  }
}
