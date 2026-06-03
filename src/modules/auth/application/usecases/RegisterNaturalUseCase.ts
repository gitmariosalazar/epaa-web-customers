import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RegisterNaturalUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(payload: any): Promise<any> {
    return this.authRepository.registerNatural(payload);
  }
}
