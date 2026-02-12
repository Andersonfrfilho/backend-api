import { Observable } from 'rxjs';

/**
 * HTTP methods supported
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * Content types for HTTP requests
 */
export enum ContentType {
  JSON = 'application/json',
  FORM_URLENCODED = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data',
  TEXT = 'text/plain',
  XML = 'application/xml',
}

/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  contentType?: ContentType;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  cache?: boolean; // Enable/disable caching for this request
  cacheTtl?: number; // Cache TTL in milliseconds
}

/**
 * HTTP response structure
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestConfig;
  request?: any;
}

/**
 * HTTP error structure
 */
export interface HttpError extends Error {
  config: HttpRequestConfig;
  response?: HttpResponse;
  status?: number;
  statusText?: string;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (error: any) => any;

/**
 * HTTP provider interface
 */
export interface HttpProviderInterface {
  /**
   * Make a GET request
   */
  get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a POST request
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a PUT request
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a PATCH request
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a DELETE request
   */
  delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a HEAD request
   */
  head<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make an OPTIONS request
   */
  options<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>>;

  /**
   * Make a generic HTTP request
   */
  request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Set global headers
   */
  setGlobalHeader(key: string, value: string): void;

  /**
   * Remove global header
   */
  removeGlobalHeader(key: string): void;

  /**
   * Get global headers
   */
  getGlobalHeaders(): Record<string, string>;

  /**
   * Set base URL for all requests
   */
  setBaseUrl(baseUrl: string): void;

  /**
   * Get current base URL
   */
  getBaseUrl(): string;

  /**
   * Set default timeout
   */
  setDefaultTimeout(timeout: number): void;

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): number;

  /**
   * Remove error interceptor
   */
  removeErrorInterceptor(id: number): void;

  /**
   * Clear cache for a specific key or all cache
   */
  clearCache(key?: string): void;

  /**
   * Set authorization token
   */
  setAuthToken(token: string, type?: string): void;

  /**
   * Clear authorization token
   */
  clearAuthToken(): void;

  /**
   * Observable version for reactive programming
   */
  get$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>>;
  post$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>>;
  put$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>>;
  patch$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>>;
  delete$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>>;
  head$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>>;
  options$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>>;
  request$<T = any>(config: HttpRequestConfig): Observable<HttpResponse<T>>;
}
