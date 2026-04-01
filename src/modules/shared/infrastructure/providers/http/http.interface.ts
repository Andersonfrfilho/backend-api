import { Observable } from 'rxjs';

export interface HttpRequestConfig {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  [key: string]: any;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  config?: HttpRequestConfig;
}

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpProviderInterface {
  // Promise API
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  patch<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  head<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  options<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  // Observable API
  get$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  post$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  put$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  patch$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  delete$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  head$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  options$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>>;
  request$<T>(config: HttpRequestConfig): Observable<HttpResponse<T>>;

  // Interceptors
  addRequestInterceptor(onFulfilled?: any, onRejected?: any): number;
  addResponseInterceptor(onFulfilled?: any, onRejected?: any): number;
  removeRequestInterceptor(interceptorId: number): void;
  removeResponseInterceptor(interceptorId: number): void;
  // Error-specific interceptors (legacy names)
  addErrorInterceptor(onFulfilled?: any, onRejected?: any): number;
  removeErrorInterceptor(id: number): void;

  // Configuration
  createInstance(config?: HttpClientConfig): HttpProviderInterface;
  setBaseURL(baseURL: string): void;
  // Legacy alias
  setBaseUrl(baseUrl: string): void;
  getBaseUrl(): string;
  setTimeout(timeout: number): void;
  setDefaultTimeout(timeout: number): void;
  setHeaders(headers: Record<string, string>): void;
  // Global header helpers
  setGlobalHeader(key: string, value: string): void;
  removeGlobalHeader(key: string): void;
  getGlobalHeaders(): Record<string, string>;
  setAuthToken(token: string, type?: string): void;
  clearAuthToken(): void;
  clearCache(key?: string): void;
  // Optional access to underlying axios instance if present
  getAxiosInstance?(): any;
}

export default HttpProviderInterface;
