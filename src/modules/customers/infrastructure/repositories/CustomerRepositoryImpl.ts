import type {
  CreateCustomerRequest,
  CustomerRepository,
  UpdateCustomerRequest
} from '../../domain/repositories/CustomerRepository';
import type { Customer } from '../../domain/models/Customer';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/**
 * CustomerRepositoryImpl
 *
 * Implements all endpoints exposed by the backend:
 *   /services/customers/modules/clients/infrastructure/controllers/customer.gateway.controller.ts
 *
 * Clean Architecture: infrastructure concern only — no business logic here.
 * SOLID (DIP): depends on HttpClientInterface, not on a concrete HTTP client.
 */
export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ── POST /Customers/create-customer ────────────────────────────────────────
  async create(customer: CreateCustomerRequest): Promise<void> {
    await this.client.post<ApiResponse<void>>(
      '/Customers/create-customer',
      customer
    );
  }

  // ── PUT /Customers/update-customer/:customerId ──────────────────────────────
  async update(customerId: string, customer: UpdateCustomerRequest): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/Customers/update-customer/${customerId}`,
      customer
    );
  }

  // ── DELETE /Customers/delete-customer/:customerId ───────────────────────────
  async delete(customerId: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/Customers/delete-customer/${customerId}`
    );
  }

  // ── GET /Customers/get-customer-by-id/:customerId ──────────────────────────
  // Public: used during registration lookup — no token required.
  async getById(customerId: string): Promise<Customer> {
    const response = await this.client.get<ApiResponse<Customer>>(
      `/Customers/get-customer-by-id/${customerId}`,
      { skipAuth: true }
    );
    return response.data.data;
  }

  // ── GET /Customers/get-all-customers?limit=&offset= ────────────────────────
  async getAll(limit: number, offset: number): Promise<Customer[]> {
    const response = await this.client.get<ApiResponse<Customer[]>>(
      '/Customers/get-all-customers',
      { params: { limit, offset } }
    );
    return response.data.data;
  }

  // ── GET /Customers/verify-customer-exists/:customerId ──────────────────────
  async verifyExists(customerId: string): Promise<boolean> {
    try {
      const response = await this.client.get<ApiResponse<boolean>>(
        `/Customers/verify-customer-exists/${customerId}`,
        { skipAuth: true }
      );
      return response.data.data ?? false;
    } catch {
      return false;
    }
  }

  // ── GET /Customers/get-general-customers?limit=&offset= ────────────────────
  async getGeneralCustomers(limit: number, offset: number): Promise<Customer[]> {
    const response = await this.client.get<ApiResponse<Customer[]>>(
      '/Customers/get-general-customers',
      { params: { limit, offset } }
    );
    return response.data.data;
  }

  // ── GET /Customers/get-customer-by-identification/:identification ───────────
  // Public lookup used during registration to pre-fill the form.
  async findByIdentification(identification: string): Promise<Customer | null> {
    try {
      const response = await this.client.get<ApiResponse<Customer>>(
        `/Customers/get-customer-by-identification/${identification}`,
        { skipAuth: true }
      );
      return response.data.data;
    } catch {
      return null;
    }
  }
}
