import type { Customer } from '../models/Customer';

// ─── Request DTOs — mirror backend exactly ────────────────────────────────────

/**
 * Maps to POST /Customers/create-customer
 * Backend: CreateCustomerRequest
 */
export interface CreateCustomerRequest {
  customerId: string;       // string — preserves leading zeros (e.g. '0400000000')
  firstName: string;
  lastName: string;
  emails: string[];
  phoneNumbers: string[];
  dateOfBirth: Date | string;
  sexId: number;
  civilStatus: number;
  address: string;
  professionId: number;
  originCountry: string;
  identificationType: string;
  parishId: string;
  deceased?: boolean;
}

/**
 * Maps to PUT /Customers/update-customer/:customerId
 * Backend: UpdateCustomerRequest (same shape, all optional except id)
 */
export interface UpdateCustomerRequest {
  customerId?: string;
  firstName?: string;
  lastName?: string;
  emails?: string[];
  phoneNumbers?: string[];
  dateOfBirth?: Date | string;
  sexId?: number;
  civilStatus?: number;
  address?: string;
  professionId?: number;
  originCountry?: string;
  identificationType?: string;
  parishId?: string;
  deceased?: boolean;
}

// ─── Repository interface ─────────────────────────────────────────────────────

export interface CustomerRepository {
  /** POST /Customers/create-customer */
  create(customer: CreateCustomerRequest): Promise<void>;

  /** PUT /Customers/update-customer/:customerId */
  update(customerId: string, customer: UpdateCustomerRequest): Promise<void>;

  /** DELETE /Customers/delete-customer/:customerId */
  delete(customerId: string): Promise<void>;

  /** GET /Customers/get-customer-by-id/:customerId */
  getById(customerId: string): Promise<Customer>;

  /** GET /Customers/get-all-customers?limit=&offset= */
  getAll(limit: number, offset: number): Promise<Customer[]>;

  /** GET /Customers/verify-customer-exists/:customerId */
  verifyExists(customerId: string): Promise<boolean>;

  /** GET /Customers/get-general-customers?limit=&offset= */
  getGeneralCustomers(limit: number, offset: number): Promise<Customer[]>;

  /** GET /Customers/get-customer-by-identification/:identification (frontend lookup) */
  findByIdentification(identification: string): Promise<Customer | null>;
}
