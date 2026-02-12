import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  ErrorInterceptor,
  HttpProviderInterface,
  HttpRequestConfig,
  HttpResponse,
} from './http.interface';
import { HTTP_AXIOS_PROVIDER } from './http.token';
import type { AxiosHttpProviderInterface } from './implementations/axios/axios.http.provider';

@Injectable()
export class HttpProvider implements HttpProviderInterface {
  constructor(
    @Inject(HTTP_AXIOS_PROVIDER)
    private readonly axiosHttpProvider: AxiosHttpProviderInterface,
  ) {}

  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.get<T>(url, config);
  }

  get$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.get$<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.post<T>(url, data, config);
  }

  post$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.post$<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.put<T>(url, data, config);
  }

  put$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.put$<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.patch<T>(url, data, config);
  }

  patch$<T>(url: string, data?: any, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.patch$<T>(url, data, config);
  }

  async delete<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.delete<T>(url, config);
  }

  delete$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.delete$<T>(url, config);
  }

  async head<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.head<T>(url, config);
  }

  head$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.head$<T>(url, config);
  }

  async options<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.options<T>(url, config);
  }

  options$<T>(url: string, config?: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.options$<T>(url, config);
  }

  async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.axiosHttpProvider.request<T>(config);
  }

  request$<T>(config: HttpRequestConfig): Observable<HttpResponse<T>> {
    return this.axiosHttpProvider.request$<T>(config);
  }

  setGlobalHeader(key: string, value: string): void {
    this.axiosHttpProvider.setGlobalHeader(key, value);
  }

  removeGlobalHeader(key: string): void {
    this.axiosHttpProvider.removeGlobalHeader(key);
  }

  getGlobalHeaders(): Record<string, string> {
    return this.axiosHttpProvider.getGlobalHeaders();
  }

  setBaseUrl(baseUrl: string): void {
    this.axiosHttpProvider.setBaseUrl(baseUrl);
  }

  getBaseUrl(): string {
    return this.axiosHttpProvider.getBaseUrl();
  }

  setDefaultTimeout(timeout: number): void {
    this.axiosHttpProvider.setDefaultTimeout(timeout);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): number {
    return this.axiosHttpProvider.addErrorInterceptor(interceptor);
  }

  removeErrorInterceptor(id: number): void {
    this.axiosHttpProvider.removeErrorInterceptor(id);
  }

  clearCache(key?: string): void {
    this.axiosHttpProvider.clearCache(key);
  }

  setAuthToken(token: string, type?: string): void {
    this.axiosHttpProvider.setAuthToken(token, type);
  }

  clearAuthToken(): void {
    this.axiosHttpProvider.clearAuthToken();
  }
}
