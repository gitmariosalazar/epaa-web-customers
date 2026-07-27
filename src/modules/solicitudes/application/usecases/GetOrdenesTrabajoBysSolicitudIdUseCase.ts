import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
import type { SolicitudOrdenTrabajoResponse } from '../../domain/models/Solicitud';

export class GetOrdenesTrabajoBysSolicitudIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(solicitudId: string): Promise<SolicitudOrdenTrabajoResponse[]> {
    if (!solicitudId) {
      throw new Error('El ID de la solicitud es requerido');
    }
    return this.solicitudRepository.getOrdenesTrabajoBysSolicitudId(solicitudId);
  }
}
