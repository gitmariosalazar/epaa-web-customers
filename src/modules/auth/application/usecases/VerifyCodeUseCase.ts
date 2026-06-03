import type { VerificationRepository } from '@/modules/auth/domain/repositories/VerificationRepository';

export class VerifyCodeUseCase {
  private readonly repo: VerificationRepository;

  constructor(repo: VerificationRepository) {
    this.repo = repo;
  }

  async execute(
    clienteUsuarioId: string,
    codigo: string,
    tipoCodigo = 'EMAIL_CODE',
  ): Promise<{ verified: boolean; message: string }> {
    return this.repo.verifyCode(clienteUsuarioId, codigo, tipoCodigo);
  }
}
