import type { UpdateCustomerRequest } from '@/modules/customers/domain/repositories/CustomerRepository';
import type { CustomerRepository } from '@/modules/customers/domain/repositories/CustomerRepository';

/**
 * UpdateCustomerProfileUseCase
 *
 * SRP: updates only the current customer's own profile data.
 * DIP: depends on CustomerRepository interface, not the implementation.
 * OCP: the rule of "which customer to update" is injected, not hardcoded.
 */
export class UpdateCustomerProfileUseCase {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(customerId: string, data: UpdateCustomerRequest): Promise<void> {
    if (!customerId) throw new Error('Customer ID is required to update profile');
    return this.repository.update(customerId, data);
  }
}
