import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Canton } from '../../domain/models/Canton';
import type { CantonRepository } from '../../domain/repositories/usecases/CantonRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

/** Location data is always public — no token required. */
const PUBLIC = { skipAuth: true } as const;

export class GetCantonRepositoryImpl implements CantonRepository {
  private readonly httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getAllCantons(): Promise<Canton[]> {
    const response = await this.httpClient.get<ApiResponse<Canton[]>>(
      '/location-global/get-cantons', PUBLIC
    );
    return response.data.data;
  }

  async getCantonById(id: string): Promise<Canton | null> {
    const response = await this.httpClient.get<ApiResponse<Canton>>(
      `/location-global/get-canton-by-id/${id}`, PUBLIC
    );
    return response.data.data;
  }

  async getCantonByName(name: string): Promise<Canton | null> {
    const response = await this.httpClient.get<ApiResponse<Canton>>(
      `/location-global/get-canton-by-name/${name}`, PUBLIC
    );
    return response.data.data;
  }

  async getCantonsByProvinceId(provinceId: string): Promise<Canton[]> {
    const response = await this.httpClient.get<ApiResponse<Canton[]>>(
      `/location-global/get-cantons-by-province-id/${provinceId}`, PUBLIC
    );
    return response.data.data;
  }
}
