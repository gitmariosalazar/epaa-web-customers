// ============================================================
// ACOMETIDAS — Use Case: Get catalog
// SRP: only retrieves and returns the list.
// DIP: depends on AcometidaRepository interface.
// ============================================================
import type { AcometidaRepository } from '../../domain/repositories/AcometidaRepository';
import type { AcometidaVariante } from '../../domain/models/Acometida';

export class GetAcometidaCatalogUseCase {
  private readonly repo: AcometidaRepository;
  constructor(repo: AcometidaRepository) {
    this.repo = repo;
  }
  async execute(): Promise<AcometidaVariante[]> {
    return this.repo.getAll();
  }
}
