import type { Company } from '../models/Company';

// ─── Request DTOs — mirror backend exactly ────────────────────────────────────

/**
 * Maps to POST /Customers/create-company
 * Backend: CreateCompanyRequest
 */
export interface CreateCompanyRequest {
  companyName: string;
  socialReason: string;
  companyRuc: string;
  companyAddress: string;
  companyParishId: string;
  /** 'ECUADOR' | ISO country code */
  companyCountry: string;
  /** Array of email strings */
  companyEmails: string[];
  /** Array of phone strings */
  companyPhones: string[];
  /** 'RUC' | 'CED' | 'PAS' */
  identificationType: string;
}

/**
 * Maps to PUT /Customers/update-company/:companyRuc
 * Backend: UpdateCompanyRequest
 */
export interface UpdateCompanyRequest {
  companyName?: string;
  socialReason?: string;
  companyRuc?: string;
  companyAddress?: string;
  companyParishId?: string;
  companyCountry?: string;
  companyEmails?: string[];
  companyPhones?: string[];
  identificationType?: string;
}

// ─── Repository interface ─────────────────────────────────────────────────────

export interface CompanyRepository {
  /** POST /Customers/create-company */
  create(company: CreateCompanyRequest): Promise<void>;

  /** PUT /Customers/update-company/:companyRuc */
  update(companyRuc: string, company: UpdateCompanyRequest): Promise<void>;

  /** DELETE /Customers/delete-company/:companyRuc */
  delete(companyRuc: string): Promise<void>;

  /** GET /Customers/get-company/:companyRuc */
  getByRuc(companyRuc: string): Promise<Company>;

  /** GET /Customers/get-all-companies?limit=&offset= */
  getAll(limit: number, offset: number): Promise<Company[]>;

  /** GET /Customers/verify-company-exists/:companyRuc */
  verifyExists(companyRuc: string): Promise<boolean>;
}
