import type { VerificationRepository } from '@/modules/auth/domain/repositories/VerificationRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/**
 * VerificationRepositoryImpl
 * Implementa VerificationRepository usando el mismo apiClient del proyecto.
 * DIP: el resto del código no depende de esta clase concreta.
 */
export class VerificationRepositoryImpl implements VerificationRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async resendVerificationCode(clienteUsuarioId: string, tipoCodigo = 'EMAIL_CODE'): Promise<void> {
    await this.client.post<ApiResponse<any>>(
      '/customer-gateway/resend-verification-code',
      { clienteUsuarioId, tipoCodigo },
      { skipAuth: true },
    );
  }

  async verifyCode(
    clienteUsuarioId: string,
    codigo: string,
    tipoCodigo = 'EMAIL_CODE',
  ): Promise<{ verified: boolean; message: string }> {
    const response = await this.client.post<ApiResponse<{ verified: boolean; message: string }>>(
      '/customer-gateway/verify-code',
      { clienteUsuarioId, codigo, tipoCodigo },
      { skipAuth: true },
    );
    // El gateway retorna { data: { verified, message }, message, ... }
    return response.data.data ?? { verified: true, message: '¡Cuenta verificada!' };
  }
}
