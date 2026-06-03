import type { CustomerWithRolesAndPermissionsResponse } from '@/modules/settings/domain/models/User';
import type { ChangePasswordRequest } from '@/modules/settings/domain/models/ChangePasswordRequest';
import type { UserRepository } from '@/modules/settings/domain/repositories/UserRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/**
 * UserRepositoryImpl — Profile only
 *
 * Clean Architecture: infrastructure concern only — no business logic.
 * SOLID (DIP): depends on HttpClientInterface, not on a concrete HTTP client.
 * SRP: only handles the current authenticated user's own profile/password.
 */
export class UserRepositoryImpl implements UserRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ── GET /users-gateway/get-customer-profile/:usernameOrEmail ───────────────
  async getProfile(usernameOrEmail: string): Promise<CustomerWithRolesAndPermissionsResponse> {
    const response = await this.client.get<ApiResponse<CustomerWithRolesAndPermissionsResponse>>(
      `/users-gateway/get-customer-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  // ── PUT /users-gateway/update-password/:userId ─────────────────────────────
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/users-gateway/update-password/${userId}`,
      data
    );
  }
}
