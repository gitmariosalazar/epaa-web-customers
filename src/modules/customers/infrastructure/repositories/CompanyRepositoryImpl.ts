import type {
  CompanyRepository,
  CreateCompanyRequest,
  UpdateCompanyRequest
} from '../../domain/repositories/CompanyRepository';
import type { Company } from '../../domain/models/Company';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/**
 * CompanyRepositoryImpl
 *
 * Implements all endpoints exposed by the backend:
 *   /services/customers/modules/companies/infrastructure/controllers/company.gateway.controller.ts
 *
 * Clean Architecture: infrastructure concern only — no business logic here.
 * SOLID (DIP): depends on HttpClientInterface, not on a concrete HTTP client.
 */
export class CompanyRepositoryImpl implements CompanyRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ── POST /Customers/create-company ─────────────────────────────────────────
  async create(company: CreateCompanyRequest): Promise<void> {
    await this.client.post<ApiResponse<void>>(
      '/Customers/create-company',
      company
    );
  }

  // ── PUT /Customers/update-company/:companyRuc ───────────────────────────────
  async update(companyRuc: string, company: UpdateCompanyRequest): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/Customers/update-company/${companyRuc}`,
      company
    );
  }

  // ── DELETE /Customers/delete-company/:companyRuc ────────────────────────────
  async delete(companyRuc: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/Customers/delete-company/${companyRuc}`
    );
  }

  // ── GET /Customers/get-company/:companyRuc ──────────────────────────────────
  // Public: used during registration lookup — no token required.
  async getByRuc(companyRuc: string): Promise<Company> {
    const response = await this.client.get<ApiResponse<Company>>(
      `/Customers/get-company/${companyRuc}`,
      { skipAuth: true }
    );
    return response.data.data;
  }

  // ── GET /Customers/get-all-companies?limit=&offset= ────────────────────────
  async getAll(limit: number, offset: number): Promise<Company[]> {
    const response = await this.client.get<ApiResponse<Company[]>>(
      '/Customers/get-all-companies',
      { params: { limit, offset } }
    );
    return response.data.data;
  }

  // ── GET /Customers/verify-company-exists/:companyRuc ───────────────────────
  async verifyExists(companyRuc: string): Promise<boolean> {
    try {
      const response = await this.client.get<ApiResponse<boolean>>(
        `/Customers/verify-company-exists/${companyRuc}`,
        { skipAuth: true }
      );
      return response.data.data ?? false;
    } catch {
      return false;
    }
  }
}
