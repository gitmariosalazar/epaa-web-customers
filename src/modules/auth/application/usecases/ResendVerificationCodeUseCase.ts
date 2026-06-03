import type { VerificationRepository } from '@/modules/auth/domain/repositories/VerificationRepository';

export class ResendVerificationCodeUseCase {
  private readonly repo: VerificationRepository;

  constructor(repo: VerificationRepository) {
    this.repo = repo;
  }

  async execute(clienteUsuarioId: string, tipoCodigo = 'EMAIL_CODE'): Promise<void> {
    return this.repo.resendVerificationCode(clienteUsuarioId, tipoCodigo);
  }
}
