import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import type {
  HttpProviderInterface,
  HttpRequestConfig,
  HttpResponse,
} from '../http/http.interface';

/**
 * Mock API provider for testing external API integrations
 * Implements HttpProviderInterface to provide standard HTTP methods
 */
@Injectable()
export class MockApiProvider implements HttpProviderInterface {
  constructor(private readonly httpProvider: HttpProviderInterface) {}

  /**
   * Make a GET request
   */
  async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.get(url, config);
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.post(url, data, config);
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.put(url, data, config);
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.patch(url, data, config);
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.delete(url, config);
  }

  /**
   * Make a HEAD request
   */
  async head<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.head(url, config);
  }

  /**
   * Make an OPTIONS request
   */
  async options<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    return this.httpProvider.options(url, config);
  }

  /**
   * Make a generic HTTP request
   */
  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.httpProvider.request(config);
  }

  /**
   * Set global headers
   */
  setGlobalHeader(key: string, value: string): void {
    this.httpProvider.setGlobalHeader(key, value);
  }

  /**
   * Remove global header
   */
  removeGlobalHeader(key: string): void {
    this.httpProvider.removeGlobalHeader(key);
  }

  /**
   * Get global headers
   */
  getGlobalHeaders(): Record<string, string> {
    return this.httpProvider.getGlobalHeaders();
  }

  /**
   * Clear all global headers
   */
  clearGlobalHeaders(): void {
    // Not implemented - global headers are managed by the underlying provider
  }

  /**
   * Set base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.httpProvider.setBaseUrl(baseUrl);
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.httpProvider.getBaseUrl();
  }

  /**
   * Set timeout
   */
  setTimeout(timeout: number): void {
    console.log(
      'setTimeout is not implemented in MockApiProvider. Use setDefaultTimeout instead.',
      timeout,
    );
    // Not implemented - use setDefaultTimeout instead
  }

  /**
   * Get timeout
   */
  getTimeout(): number {
    // Not implemented - timeout is managed by the underlying provider
    return 30000; // Default timeout
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.httpProvider.clearCache();
  }

  /**
   * Get posts from JSONPlaceholder
   */
  async getPosts(config?: HttpRequestConfig): Promise<HttpResponse<any[]>> {
    return this.httpProvider.get('https://jsonplaceholder.typicode.com/posts', config);
  }

  /**
   * Get a specific post
   */
  async getPost(id: number, config?: HttpRequestConfig): Promise<HttpResponse<any>> {
    return this.httpProvider.get(`https://jsonplaceholder.typicode.com/posts/${id}`, config);
  }

  /**
   * Create a new post
   */
  async createPost(
    data: { title: string; body: string; userId: number },
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<any>> {
    return this.httpProvider.post('https://jsonplaceholder.typicode.com/posts', data, config);
  }

  /**
   * Update a post
   */
  async updatePost(
    id: number,
    data: { title?: string; body?: string },
    config?: HttpRequestConfig,
  ): Promise<HttpResponse<any>> {
    return this.httpProvider.put(`https://jsonplaceholder.typicode.com/posts/${id}`, data, config);
  }

  setDefaultTimeout(timeout: number): void {
    this.httpProvider.setDefaultTimeout(timeout);
  }

  addErrorInterceptor(interceptor: any): number {
    return this.httpProvider.addErrorInterceptor(interceptor);
  }

  removeErrorInterceptor(id: number): void {
    this.httpProvider.removeErrorInterceptor(id);
  }

  setAuthToken(token: string, type?: string): void {
    this.httpProvider.setAuthToken(token, type);
  }

  clearAuthToken(): void {
    this.httpProvider.clearAuthToken();
  }

  get$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.get$<T>(url, config);
  }

  post$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.post$<T>(url, data, config);
  }

  put$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.put$<T>(url, data, config);
  }

  patch$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.patch$<T>(url, data, config);
  }

  delete$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.delete$<T>(url, config);
  }

  head$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.head$<T>(url, config);
  }

  options$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    return this.httpProvider.options$<T>(url, config);
  }

  request$<T = any>(config: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.httpProvider.request$<T>(config);
  }
}
