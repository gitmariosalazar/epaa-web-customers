import type { ApiResponse } from '../response/ApiResponse';

/**
 * Options for HTTP requests.
 *
 * `skipAuth` — when true, the request is sent without an Authorization header
 *              and without requiring a token. This is the responsibility of
 *              each repository: it knows whether its endpoint is public.
 *              The HTTP client must NEVER contain URL-pattern lists.
 *
 * `params`   — query string parameters.
 * `headers`  — additional headers to merge.
 */
export interface HttpRequestOptions {
  skipAuth?: boolean;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  [key: string]: any;
}

export interface HttpClientInterface {
  request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<ApiResponse<T>>;
  get<T>(url: string, options?: HttpRequestOptions): Promise<ApiResponse<T>>;
  post<T>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<ApiResponse<T>>;
  put<T>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: HttpRequestOptions): Promise<ApiResponse<T>>;
  patch<T>(
    url: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<ApiResponse<T>>;
  setUnauthorizedHandler: (handler: (error: any) => Promise<void>) => void;
}
