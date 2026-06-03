/** Contrato de dominio para operaciones de verificación de cuenta */
export interface VerificationRepository {
  /** Envía (o reenvía) el código de verificación al email del cliente */
  resendVerificationCode(clienteUsuarioId: string, tipoCodigo?: string): Promise<void>;
  /** Valida el código ingresado por el usuario */
  verifyCode(clienteUsuarioId: string, codigo: string, tipoCodigo?: string): Promise<{ verified: boolean; message: string }>;
}
