import type { UpdateCompanyRequest } from '@/modules/customers/domain/repositories/CompanyRepository';
import type { CompanyRepository } from '@/modules/customers/domain/repositories/CompanyRepository';

/**
 * UpdateCompanyProfileUseCase
 *
 * SRP: updates only the current company's own profile data.
 * DIP: depends on CompanyRepository interface, not the implementation.
 */
export class UpdateCompanyProfileUseCase {
  private readonly repository: CompanyRepository;

  constructor(repository: CompanyRepository) {
    this.repository = repository;
  }

  async execute(companyRuc: string, data: UpdateCompanyRequest): Promise<void> {
    if (!companyRuc) throw new Error('Company RUC is required to update profile');
    return this.repository.update(companyRuc, data);
  }
}
