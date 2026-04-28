// ============================================================
// APPLICATION LAYER — Register Use Case (SRP)
// Specific to the public EPAA acometidas portal.
// ============================================================

import type { RegisterCredentials, AuthSession } from '@/modules/auth/domain/models/Auth';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RegisterUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: RegisterCredentials): Promise<AuthSession> {
    return this.authRepository.register(credentials);
  }
}
