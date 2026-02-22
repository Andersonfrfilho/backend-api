import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthProvider } from '@modules/auth/application/auth.provider';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';
import type {
  HttpProviderInterface,
  HttpRequestConfig,
  HttpResponse,
} from '@modules/shared/infrastructure/providers/http/http.interface';
import { HTTP_PROVIDER } from '@modules/shared/infrastructure/providers/http/http.token';

/**
 * Authenticated HTTP provider that automatically adds tokens to requests
 */
@Injectable()
export class AuthenticatedHttpProvider implements HttpProviderInterface {
  constructor(
    @Inject(HTTP_PROVIDER)
    private readonly httpProvider: HttpProviderInterface,
    private readonly authProvider: AuthProvider,
    @Inject(LOG_PROVIDER) private readonly loggerProvider?: any,
  ) {}

  async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.get - acquiring token', params: { url } });
    } catch (e) {
      // ignore logging errors
    }

    const token = await this.authProvider.getAccessToken();

    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.get - token acquired', params: { url } });
    } catch (e) {
      // ignore logging errors
    }

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.get<T>(url, authConfig);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.post - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.post - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.post<T>(url, data, authConfig);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.put - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.put - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.put<T>(url, data, authConfig);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.patch - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.patch - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.patch<T>(url, data, authConfig);
  }

  async delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.delete - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.delete - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.delete<T>(url, authConfig);
  }

  async head<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.head - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.head - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.head<T>(url, authConfig);
  }

  async options<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.options - acquiring token', params: { url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.options - token acquired', params: { url } });
    } catch (e) {}

    const authConfig = this.addAuthHeader(config, token);
    return this.httpProvider.options<T>(url, authConfig);
  }

  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.request - acquiring token', params: { url: config.url } });
    } catch (e) {}

    const token = await this.authProvider.getAccessToken();
    try {
      this.loggerProvider?.info?.({ message: 'AuthenticatedHttpProvider.request - token acquired', params: { url: config.url } });
    } catch (e) {}

    const authConfig = this.addAuthHeaderToRequest(config, token);
    return this.httpProvider.request<T>(authConfig);
  }

  setGlobalHeader(key: string, value: string): void {
    this.httpProvider.setGlobalHeader(key, value);
  }

  removeGlobalHeader(key: string): void {
    this.httpProvider.removeGlobalHeader(key);
  }

  getGlobalHeaders(): Record<string, string> {
    return this.httpProvider.getGlobalHeaders();
  }

  clearGlobalHeaders(): void {
    // Not implemented - global headers are managed by the underlying provider
  }

  setTimeout(timeout: number): void {
    // Not implemented - use setDefaultTimeout instead
  }

  getTimeout(): number {
    // Not implemented - timeout is managed by the underlying provider
    return 30000; // Default timeout
  }

  setCacheEnabled(enabled: boolean): void {
    // Not implemented - caching is managed by the underlying provider
  }

  isCacheEnabled(): boolean {
    // Not implemented - caching is managed by the underlying provider
    return false;
  }

  getCacheStats(): any {
    // Not implemented - cache stats are managed by the underlying provider
    return {};
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

  clearCache(key?: string): void {
    this.httpProvider.clearCache(key);
  }

  setAuthToken(token: string, type?: string): void {
    this.httpProvider.setAuthToken(token, type);
  }

  clearAuthToken(): void {
    this.httpProvider.clearAuthToken();
  }

  setBaseUrl(baseUrl: string): void {
    this.httpProvider.setBaseUrl(baseUrl);
  }

  getBaseUrl(): string {
    return this.httpProvider.getBaseUrl();
  }

  get$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    // For authenticated requests, we need to get the token synchronously
    // This is a limitation - observable methods may not work with async token retrieval
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  post$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  put$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  patch$<T = any>(
    url: string,
    data?: any,
    config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  delete$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  head$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  options$<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'url' | 'method'>,
  ): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  request$<T = any>(config: HttpRequestConfig): Observable<HttpResponse<T>> {
    throw new Error('Observable methods not supported for authenticated HTTP provider');
  }

  private addAuthHeader(
    config: Omit<HttpRequestConfig, 'url' | 'method'> | undefined,
    token: string,
  ): Omit<HttpRequestConfig, 'url' | 'method'> | undefined {
    if (!config) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private addAuthHeaderToRequest(config: HttpRequestConfig, token: string): HttpRequestConfig {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
