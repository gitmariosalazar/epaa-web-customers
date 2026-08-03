// ============================================================
// ACOMETIDAS — Repository Implementation (Infrastructure)
// OCP: swappable with API impl — just implement AcometidaRepository.
// ============================================================
import type { AcometidaRepository } from '../../domain/repositories/AcometidaRepository';
import type { AcometidaVariante } from '../../domain/models/Acometida';
import { ACOMETIDAS_CATALOG } from '../data/AcometidaRequisitos';

export class AcometidaRepositoryImpl implements AcometidaRepository {
  async getAll(): Promise<AcometidaVariante[]> {
    return ACOMETIDAS_CATALOG.filter((v) => v.activo);
  }

  async getById(id: string): Promise<AcometidaVariante | null> {
    return ACOMETIDAS_CATALOG.find((v) => v.id === id) ?? null;
  }
}
