import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';

import {
  ErrorInterceptor,
  HttpProviderInterface,
  HttpRequestConfig,
  HttpResponse,
} from '../../http.interface';

/**
 * Interface for Axios HTTP Provider
 */
export interface AxiosHttpProviderInterface extends HttpProviderInterface {}

/**
 * Simple cache entry
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Axios-based implementation of the HTTP provider interface.
 * Provides HTTP client functionality with both Promise and Observable APIs,
 * plus basic caching capabilities.
 */
export class AxiosHttpProvider implements AxiosHttpProviderInterface {
  private axiosInstance: AxiosInstance;
  private errorInterceptors: Map<number, ErrorInterceptor> = new Map();
  private nextErrorInterceptorId = 0;
  private cache = new Map<string, CacheEntry<any>>();
  private cacheCleanupInterval?: NodeJS.Timeout;

  constructor(axiosInstance?: AxiosInstance) {
    this.axiosInstance = axiosInstance || axios.create();
    this.startCacheCleanup();
  }

  /**
   * Starts automatic cache cleanup
   */
  private startCacheCleanup(): void {
    // Clean expired cache entries every 5 minutes
    this.cacheCleanupInterval = setInterval(() => {
      this.cleanupExpiredCache();
    }, 300000);
  }

  /**
   * Stops automatic cache cleanup
   */
  private stopCacheCleanup(): void {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
      this.cacheCleanupInterval = undefined;
    }
  }

  /**
   * Cleans up expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Generates a cache key from URL and config
   */
  private generateCacheKey(url: string, config?: HttpRequestConfig): string {
    const params = config?.params ? JSON.stringify(config.params) : '';
    return `${url}${params}`;
  }

  /**
   * Gets cached data if valid
   */
  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Sets data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number = 300000): void {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clears cache for a specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Sets a global header that will be included in all requests.
   */
  setGlobalHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Removes a global header.
   */
  removeGlobalHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Gets all global headers currently set.
   */
  getGlobalHeaders(): Record<string, string> {
    return { ...this.axiosInstance.defaults.headers.common } as Record<string, string>;
  }

  /**
   * Sets the base URL for all requests.
   */
  setBaseUrl(baseUrl: string): void {
    this.axiosInstance.defaults.baseURL = baseUrl;
  }

  /**
   * Gets the current base URL.
   */
  getBaseUrl(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }

  /**
   * Sets the default timeout for all requests.
   */
  setDefaultTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * Adds an error interceptor for handling errors globally.
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): number {
    const id = this.nextErrorInterceptorId++;
    this.errorInterceptors.set(id, interceptor);
    return id;
  }

  /**
   * Removes an error interceptor by its ID.
   */
  removeErrorInterceptor(id: number): void {
    this.errorInterceptors.delete(id);
  }

  /**
   * Performs a GET request to the specified URL.
   */
  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const cacheKey = this.generateCacheKey(url, config);
    const cached = this.getCached<T>(cacheKey);
    if (cached) {
      return {
        data: cached,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || { url },
      } as HttpResponse<T>;
    }

    return this.wrapWithErrorInterceptors(() => this.performGet<T>(url, config, cacheKey));
  }

  /**
   * Internal method to perform the actual GET request.
   */
  private async performGet<T>(
    url: string,
    config?: HttpRequestConfig,
    cacheKey?: string,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    const transformed = this.transformResponse<T>(response);

    if (cacheKey && config?.cache !== false) {
      this.setCache(cacheKey, transformed.data, config?.cacheTtl);
    }

    return transformed;
  }

  /**
   * Performs a GET request and returns an Observable.
   */
  get$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.get<T>(url, config));
  }

  /**
   * Performs a POST request.
   */
  async post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performPost<T>(url, data, config));
  }

  /**
   * Internal method to perform the actual POST request.
   */
  private async performPost<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a POST request and returns an Observable.
   */
  post$<T>(url: string, data?: unknown, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.post<T>(url, data, config));
  }

  /**
   * Performs a PUT request.
   */
  async put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performPut<T>(url, data, config));
  }

  /**
   * Internal method to perform the actual PUT request.
   */
  private async performPut<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a PUT request and returns an Observable.
   */
  put$<T>(url: string, data?: unknown, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.put<T>(url, data, config));
  }

  /**
   * Performs a PATCH request.
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performPatch<T>(url, data, config));
  }

  /**
   * Internal method to perform the actual PATCH request.
   */
  private async performPatch<T>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a PATCH request and returns an Observable.
   */
  patch$<T>(url: string, data?: unknown, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.patch<T>(url, data, config));
  }

  /**
   * Performs a DELETE request.
   */
  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performDelete<T>(url, config));
  }

  /**
   * Internal method to perform the actual DELETE request.
   */
  private async performDelete<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a DELETE request and returns an Observable.
   */
  delete$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.delete<T>(url, config));
  }

  /**
   * Performs a HEAD request.
   */
  async head<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performHead<T>(url, config));
  }

  /**
   * Internal method to perform the actual HEAD request.
   */
  private async performHead<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.head<T>(url, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a HEAD request and returns an Observable.
   */
  head$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.head<T>(url, config));
  }

  /**
   * Performs an OPTIONS request.
   */
  async options<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performOptions<T>(url, config));
  }

  /**
   * Internal method to perform the actual OPTIONS request.
   */
  private async performOptions<T>(
    url: string,
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.options<T>(url, config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs an OPTIONS request and returns an Observable.
   */
  options$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.options<T>(url, config));
  }

  /**
   * Performs a custom HTTP request.
   */
  async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.wrapWithErrorInterceptors(() => this.performRequest<T>(config));
  }

  /**
   * Internal method to perform the actual custom request.
   */
  private async performRequest<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.request<T>(config);
    return this.transformResponse<T>(response);
  }

  /**
   * Performs a custom HTTP request and returns an Observable.
   */
  request$<T>(config: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.request<T>(config));
  }

  /**
   * Sets the authorization token for requests.
   */
  setAuthToken(token: string, type: string = 'Bearer'): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `${type} ${token}`;
  }

  /**
   * Clears the authorization token.
   */
  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Processes an error through all registered error interceptors.
   */
  private async processErrorInterceptors(error: unknown): Promise<unknown> {
    let processedError = error;

    for (const interceptor of this.errorInterceptors.values()) {
      try {
        processedError = await interceptor(processedError);
      } catch (interceptorError) {
        console.warn('Error interceptor failed:', interceptorError);
      }
    }

    return processedError;
  }

  /**
   * Wraps a promise-returning HTTP method with error interceptor processing.
   */
  private async wrapWithErrorInterceptors<T>(
    method: () => Promise<HttpResponse<T>>,
  ): Promise<HttpResponse<T>> {
    try {
      return await method();
    } catch (error) {
      const processedError = await this.processErrorInterceptors(error);
      throw processedError;
    }
  }

  /**
   * Transforms an Axios response to the standardized HTTP response format.
   */
  private transformResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      config: response.config as HttpRequestConfig,
    };
  }
}
