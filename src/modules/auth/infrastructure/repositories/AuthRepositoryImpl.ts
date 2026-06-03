import type {
  AuthSession,
  LoginCredentials,
  RegisterCredentials
} from '@/modules/auth/domain/models/Auth';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class AuthRepositoryImpl implements AuthRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/client/signin',
      credentials,
      { skipAuth: true }
    );
    return response.data.data;
  }

  async signOut(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    await this.client.post('/auth/signout', { refreshToken });
  }

  async refreshToken(): Promise<AuthSession> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );
    return response.data.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/register',
      credentials,
      { skipAuth: true }
    );
    return response.data.data;
  }

  async registerNatural(payload: any): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>(
      '/customer-gateway/register-natural',
      payload,
      { skipAuth: true }
    );
    return response.data.data;
  }

  async registerCompany(payload: any): Promise<any> {
    const response = await this.client.post<ApiResponse<any>>(
      '/customer-gateway/register-company',
      payload,
      { skipAuth: true }
    );
    return response.data.data;
  }
}
