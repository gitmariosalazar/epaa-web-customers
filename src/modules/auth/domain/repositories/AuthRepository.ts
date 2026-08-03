import type { AuthSession, LoginCredentials, RegisterCredentials, VerifyUserRequest, VerifyUserResult } from '../models/Auth';

export interface AuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  register(credentials: RegisterCredentials): Promise<AuthSession>;
  refreshToken(): Promise<AuthSession>;
  registerNatural(payload: any): Promise<any>;
  registerCompany(payload: any): Promise<any>;
  verifyUser(payload: VerifyUserRequest): Promise<VerifyUserResult>;
}
