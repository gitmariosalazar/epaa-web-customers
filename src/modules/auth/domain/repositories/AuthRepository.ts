import type { AuthSession, LoginCredentials, RegisterCredentials } from '../models/Auth';

export interface AuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  register(credentials: RegisterCredentials): Promise<AuthSession>;
  refreshToken(): Promise<AuthSession>;
  registerNatural(payload: any): Promise<any>;
  registerCompany(payload: any): Promise<any>;
}
