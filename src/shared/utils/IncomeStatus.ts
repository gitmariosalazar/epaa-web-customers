/**
 * IncomeStatus — Utilidades para el estado de ingreso contable (Estado_Ingreso).
 * Centraliza labels y colores de chip para evitar duplicación.
 */

/** Status semántico aceptado por ColorChip */
export type ChipStatus = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'accent';

/** Valores válidos de estado de ingreso que llegan desde el backend */
export type TypeIncomeStatus =
  | 'PAGADO'
  | 'PENDIENTE'
  | 'PARCIAL'
  | 'ANULADO'
  | 'EXONERADO'
  | string; // fallback para valores desconocidos

const LABEL_MAP: Record<string, string> = {
  PAGADO: 'Pagado',
  PENDIENTE: 'Pendiente',
  PARCIAL: 'Parcial',
  ANULADO: 'Anulado',
  EXONERADO: 'Exonerado',
};

const COLOR_MAP: Record<string, ChipStatus> = {
  PAGADO: 'success',
  PENDIENTE: 'warning',
  PARCIAL: 'info',
  ANULADO: 'error',
  EXONERADO: 'secondary',
};

/**
 * Retorna el label legible para un estado de ingreso.
 * Si no se reconoce, devuelve el valor original.
 */
export function getLabelIncomeStatus(status: TypeIncomeStatus): string {
  if (!status) return '—';
  const upper = String(status).toUpperCase();
  return LABEL_MAP[upper] ?? status;
}

/**
 * Retorna el color de chip semántico para un estado de ingreso.
 * Si no se reconoce, devuelve 'primary'.
 */
export function getColorIncomeStatus(status: TypeIncomeStatus): ChipStatus {
  if (!status) return 'primary';
  const upper = String(status).toUpperCase();
  return COLOR_MAP[upper] ?? 'primary';
}
