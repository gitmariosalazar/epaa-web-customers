/**
 * Customer domain model.
 * Fields match exactly the backend CreateCustomerRequest / UpdateCustomerRequest DTOs:
 * /services/customers/modules/clients/domain/schemas/dto/request/
 */
export interface Customer {
  /** Cédula / identification number — stored as string to preserve leading zeros */
  customerId: string;
  firstName: string;
  lastName: string;
  /** Array of email addresses */
  emails: string[];
  /** Array of phone numbers */
  phoneNumbers: string[];
  /** ISO date string or Date object */
  dateOfBirth: string | null;
  /** Sex catalog ID */
  sexId: number;
  /** Civil status catalog ID */
  civilStatus: number;
  address: string | null;
  /** Profession catalog ID */
  professionId: number;
  originCountry: string | null;
  /** 'CED' | 'PAS' | 'RUC' */
  identificationType: string;
  /** Parish ID (location) */
  parishId: string;
  deceased: boolean;
}
