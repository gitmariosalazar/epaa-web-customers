// ============================================================
// ACOMETIDAS — Domain Model
// Fully independent — imports only from @/shared/domain.
// ============================================================
import type { Requisito, TipoPersona } from '@/shared/domain/models/TramiteBase';

export type TipoAcometida = 'agua_potable' | 'alcantarillado';

export interface AcometidaVariante {
  id: string;
  nombre: string;
  descripcion: string;
  tipoAcometida: TipoAcometida;
  tipoPersona: TipoPersona;
  requisitos: Requisito[];
  costoTotal: number;
  tiempoEstimadoDias: number;
  color: string;
  icono: string;
  activo: boolean;
}
