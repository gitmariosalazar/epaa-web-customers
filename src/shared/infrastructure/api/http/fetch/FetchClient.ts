import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { HttpClientInterface, HttpRequestOptions } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { environments } from '@/settings/environments/environments';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export class FetchHttpClient implements HttpClientInterface {
  constructor() {
    console.log(
      `FetchHttpClient initialized with API URL: ${environments.API_URL}`
    );
  }

  private unauthorizedHandler?: (error: any) => Promise<void>;

  setUnauthorizedHandler(handler: (error: any) => Promise<void>) {
    this.unauthorizedHandler = handler;
  }

  async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options: HttpRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, params, headers: extraHeaders, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(extraHeaders || {})
    };

    const token = localStorage.getItem('token');

    if (token) {
      // Always attach token if present — it never hurts public endpoints
      headers['Authorization'] = `Bearer ${token}`;
    } else if (!skipAuth) {
      // No token and the repository did not mark this as public → abort
      const error: any = new Error('No token found');
      if (this.unauthorizedHandler) {
        await this.unauthorizedHandler(error);
      }
      throw error;
    }

    let fullUrl = `${environments.API_URL}${url}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }

    try {
      const response = await fetch(fullUrl, {
        method: method.toUpperCase(),
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...fetchOptions
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401 && this.unauthorizedHandler) {
          const isAuthRequest =
            url.includes('/auth/client/signin') ||
            url.includes('/auth/register') ||
            url.includes('/auth/signin') ||
            url.includes('/auth/login');

          if (!isAuthRequest) {
            await this.unauthorizedHandler(new Error('Unauthorized'));
          }
        }

        const errorMessage =
          responseData?.message?.[0] ||
          responseData?.message ||
          'Request failed!';
        throw new Error(errorMessage);
      }

      const apiResponse: ApiResponse<T> = {
        status_code: response.status,
        time: dateService.getCurrentDate(),
        message: responseData.message || ['Request successful'],
        url: fullUrl,
        data: responseData
      };

      return apiResponse;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request was aborted');
      }
      throw new Error(error.message || 'Unexpected error occurred');
    }
  }

  async get<T>(url: string, options: HttpRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, body?: unknown, options: HttpRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T>(url: string, body?: unknown, options: HttpRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async delete<T>(url: string, options: HttpRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  async patch<T>(url: string, body?: unknown, options: HttpRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }
}
