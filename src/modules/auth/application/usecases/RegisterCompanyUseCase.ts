import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RegisterCompanyUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(payload: any): Promise<any> {
    return this.authRepository.registerCompany(payload);
  }
}
