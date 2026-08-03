// ============================================================
// ACOMETIDAS — Repository Interface (DIP)
// ============================================================
import type { AcometidaVariante } from '../models/Acometida';

export interface AcometidaRepository {
  /** Returns all active acometida variants */
  getAll(): Promise<AcometidaVariante[]>;
  /** Returns a single variant by ID */
  getById(id: string): Promise<AcometidaVariante | null>;
}
