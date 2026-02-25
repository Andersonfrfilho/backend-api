/**
 * @fileoverview Rate Limiting Interceptor for Brute Force Protection
 * @description Protege contra ataques de força bruta limitando requisições por IP
 *
 * Estratégia:
 * - Rastreia requisições por IP em memória
 * - Bloqueia após X tentativas em Y segundos
 * - Reset automático após timeout
 * - Configurável por rota
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RateLimitErrorFactory } from '@modules/shared/application/factories';

/**
 * Configuração de rate limit
 * @param maxAttempts Número máximo de requisições
 * @param windowMs Janela de tempo em ms
 * @param message Mensagem de erro
 */
export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  message?: string;
}

/**
 * Registro de requisição
 */
interface RequestRecord {
  count: number;
  resetTime: number;
}

/**
 * Rate Limiting Interceptor
 *
 * Uso:
 * @UseInterceptors(new RateLimitInterceptor({ maxAttempts: 5, windowMs: 60000 }))
 * @Post('/login')
 * login() { }
 */
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private requestMap = new Map<string, RequestRecord>();

  constructor(private config: RateLimitConfig) {
    // Limpar registros expirados a cada 60 segundos
    setInterval(() => this.cleanupExpiredRecords(), 60000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);

    const now = Date.now();
    const record = this.requestMap.get(ip);

    // Novo IP ou janela expirou
    if (!record || now > record.resetTime) {
      this.requestMap.set(ip, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return next.handle();
    }

    // Incrementar contador
    record.count++;

    // Verificar limite
    if (record.count > this.config.maxAttempts) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      throw RateLimitErrorFactory.tooManyRequests(retryAfter);
    }

    // Adicionar header com informações
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', this.config.maxAttempts);
    response.setHeader('X-RateLimit-Remaining', this.config.maxAttempts - record.count);
    response.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    return next.handle();
  }

  /**
   * Extrai IP do cliente da requisição
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0].trim() ||
      request.headers['x-client-ip'] ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Remove registros expirados da memória
   */
  private cleanupExpiredRecords(): void {
    const now = Date.now();
    for (const [ip, record] of this.requestMap.entries()) {
      if (now > record.resetTime) {
        this.requestMap.delete(ip);
      }
    }
  }

  /**
   * Retorna estatísticas (útil para debug)
   */
  getStats() {
    return {
      trackedIps: this.requestMap.size,
      records: Array.from(this.requestMap.entries()).map(([ip, record]) => ({
        ip,
        count: record.count,
        resetTime: new Date(record.resetTime).toISOString(),
      })),
    };
  }
}
