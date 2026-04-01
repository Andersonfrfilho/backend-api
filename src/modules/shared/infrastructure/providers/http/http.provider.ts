import { from, Observable } from 'rxjs';

import type {
  HttpProviderInterface,
  HttpRequestConfig,
  HttpResponse,
  HttpClientConfig,
} from './http.interface';

export class HttpProvider implements HttpProviderInterface {
  private baseURL = '';
  private timeout = 0;
  private headers: Record<string, string> = {};
  private authToken?: string;

  private reqInterceptors: Array<{
    id: number;
    fulfilled: (c: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
    rejected?: (e: any) => any;
  }> = [];
  private resInterceptors: Array<{
    id: number;
    fulfilled: (r: HttpResponse<any>) => HttpResponse<any> | Promise<HttpResponse<any>>;
    rejected?: (e: any) => any;
  }> = [];
  private nextInterceptorId = 1;

  constructor(config?: HttpClientConfig) {
    if (config?.baseURL) this.baseURL = config.baseURL;
    if (config?.timeout) this.timeout = config.timeout;
  }

  createInstance(config?: HttpClientConfig): HttpProviderInterface {
    return new HttpProvider(config);
  }

  // Provide access to an underlying axios instance when available (not used in this provider)
  getAxiosInstance() {
    return undefined;
  }

  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Legacy alias expected by other providers
  setBaseUrl(baseUrl: string) {
    this.setBaseURL(baseUrl);
  }

  getBaseUrl(): string {
    return this.baseURL;
  }

  setTimeout(timeout: number) {
    this.timeout = timeout;
  }

  setHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
  }

  // Convenience global header helpers used elsewhere in the codebase
  setGlobalHeader(key: string, value: string) {
    this.headers = { ...this.headers, [key]: value };
  }

  removeGlobalHeader(key: string) {
    const headersCopy = { ...this.headers };
    delete headersCopy[key];
    this.headers = headersCopy;
  }

  getGlobalHeaders(): Record<string, string> {
    return { ...this.headers };
  }

  setAuthToken(token: string, type = 'Bearer') {
    this.authToken = token ? `${type} ${token}` : undefined;
  }

  clearAuthToken() {
    this.authToken = undefined;
  }

  private async runRequestInterceptors(config: HttpRequestConfig): Promise<HttpRequestConfig> {
    let c = config;
    for (const it of this.reqInterceptors) {
      try {
        // allow interceptor to modify config

        c = await it.fulfilled(c);
      } catch (e) {
        if (it.rejected) it.rejected(e);
      }
    }
    return c;
  }

  private async runResponseInterceptors<T>(res: HttpResponse<T>): Promise<HttpResponse<T>> {
    let r = res;
    for (const it of this.resInterceptors) {
      try {
        r = await it.fulfilled(r);
      } catch (e) {
        if (it.rejected) it.rejected(e);
      }
    }
    return r;
  }

  // Error interceptor helpers (legacy names)
  addErrorInterceptor(onFulfilled: any, onRejected?: any) {
    return this.addResponseInterceptor(onFulfilled, onRejected);
  }

  removeErrorInterceptor(id: number) {
    return this.removeResponseInterceptor(id);
  }

  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const finalConfig = await this.runRequestInterceptors({ ...config });

    const method = (finalConfig.method || 'GET').toUpperCase();
    const url = finalConfig.url?.startsWith('http')
      ? finalConfig.url
      : `${this.baseURL}${finalConfig.url || ''}`;

    const headers: Record<string, string> = { ...(finalConfig.headers || {}), ...this.headers };
    if (this.authToken) headers.Authorization = this.authToken;

    const controller = new AbortController();
    const timeout = finalConfig.timeout ?? this.timeout;
    let timer: NodeJS.Timeout | undefined;
    if (timeout && timeout > 0) {
      timer = setTimeout(() => controller.abort(), timeout);
    }

    const fetchOptions: any = {
      method,
      headers,
      signal: controller.signal,
    };

    if (finalConfig.data != null && method !== 'GET' && method !== 'HEAD') {
      if (typeof finalConfig.data === 'string' || finalConfig.data instanceof URLSearchParams) {
        fetchOptions.body = finalConfig.data;
      } else {
        fetchOptions.body = JSON.stringify(finalConfig.data);
        fetchOptions.headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };
      }
    }

    try {
      const resp = await fetch(url, fetchOptions);
      if (timer) clearTimeout(timer);

      const contentType = resp.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await resp.json();
      } else {
        data = await resp.text();
      }

      const result: HttpResponse<T> = {
        data,
        status: resp.status,
        statusText: resp.statusText,
        headers: {},
        config: finalConfig,
      };

      return this.runResponseInterceptors(result);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        throw new Error('Request aborted due to timeout');
      }
      throw error;
    }
  }

  // Cache clearing helper (no-op for this simple provider)
  clearCache(key?: string) {
    // provider does not implement cache; noop to satisfy interface
    void key;
    return;
  }

  setDefaultTimeout(timeout: number) {
    this.setTimeout(timeout);
  }

  // Promise-based helpers
  get<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'GET' });
  }
  post<T>(url: string, data?: any, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'POST', data });
  }
  put<T>(url: string, data?: any, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'PUT', data });
  }
  patch<T>(url: string, data?: any, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'PATCH', data });
  }
  delete<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'DELETE' });
  }
  head<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'HEAD' });
  }
  options<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>({ ...(config || {}), url, method: 'OPTIONS' });
  }

  // Observable-based helpers (wrap promise)
  get$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.get<T>(url, config));
  }
  post$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.post<T>(url, data, config));
  }
  put$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.put<T>(url, data, config));
  }
  patch$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.patch<T>(url, data, config));
  }
  delete$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.delete<T>(url, config));
  }
  head$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.head<T>(url, config));
  }
  options$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.options<T>(url, config));
  }
  request$<T>(config: HttpRequestConfig): Observable<HttpResponse<T>> {
    return from(this.request<T>(config));
  }

  addRequestInterceptor(onFulfilled: any, onRejected?: any) {
    const id = this.nextInterceptorId++;
    this.reqInterceptors.push({ id, fulfilled: onFulfilled, rejected: onRejected });
    return id;
  }

  addResponseInterceptor(onFulfilled: any, onRejected?: any) {
    const id = this.nextInterceptorId++;
    this.resInterceptors.push({ id, fulfilled: onFulfilled, rejected: onRejected });
    return id;
  }

  removeRequestInterceptor(id: number) {
    this.reqInterceptors = this.reqInterceptors.filter((i) => i.id !== id);
  }

  removeResponseInterceptor(id: number) {
    this.resInterceptors = this.resInterceptors.filter((i) => i.id !== id);
  }
}

export default HttpProvider;
