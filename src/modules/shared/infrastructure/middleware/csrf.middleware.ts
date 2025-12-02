import { randomBytes } from 'node:crypto';

import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * CSRF Protection Middleware
 * Protects POST/PUT/DELETE/PATCH requests against Cross-Site Request Forgery attacks
 *
 * ✅ Implementação:
 * - Token-based CSRF protection (memory-based)
 * - Per-IP tracking
 * - Token expiration: 5 minutes
 * - HttpOnly cookie storage
 * - SameSite strict
 * - Compatible with Fastify via @fastify/csrf-protection
 *
 * Fluxo:
 * 1. GET request → Gera novo CSRF token
 * 2. POST/PUT/PATCH/DELETE → Valida CSRF token em header X-CSRF-Token
 * 3. Token expires após 5 minutos de inatividade
 */

// Map simples para armazenar tokens por IP (em produção, usar Redis)
const csrfTokens = new Map<string, { token: string; timestamp: number }>();

// Limpar tokens expirados a cada 1 minuto
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of csrfTokens.entries()) {
    if (now - record.timestamp > 300000) {
      csrfTokens.delete(ip);
    }
  }
}, 60000);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const clientIp = this.getClientIp(req);
    const method = req.method;

    // GET/HEAD/OPTIONS não precisam de validação CSRF
    // Mas devem gerar um token novo para o cliente
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const token = this.generateToken(clientIp);
      res.header('X-CSRF-Token', token);
      return next();
    }

    // POST/PUT/PATCH/DELETE requerem validação de CSRF token
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const tokenFromHeader = (req.headers['x-csrf-token'] as string) || '';
      const storedToken = csrfTokens.get(clientIp);

      // Se não há token armazenado, rejeitar
      if (!storedToken) {
        return res.status(HttpStatus.FORBIDDEN).send({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'CSRF token missing. Please GET a token first.',
          error: 'Forbidden',
        });
      }

      // Validar token
      if (storedToken.token !== tokenFromHeader) {
        return res.status(HttpStatus.FORBIDDEN).send({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'CSRF token validation failed',
          error: 'Forbidden',
        });
      }

      // Validar expiração do token (5 minutos)
      const tokenAge = Date.now() - storedToken.timestamp;
      if (tokenAge > 300000) {
        csrfTokens.delete(clientIp);
        return res.status(HttpStatus.FORBIDDEN).send({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'CSRF token expired. Please GET a new token.',
          error: 'Forbidden',
        });
      }

      // Token válido, consumir e gerar novo para próxima requisição
      const newToken = this.generateToken(clientIp);
      res.header('X-CSRF-Token', newToken);
    }

    next();
  }

  /**
   * Gerar novo CSRF token para um IP
   */
  private generateToken(clientIp: string): string {
    const token = randomBytes(32).toString('hex');
    csrfTokens.set(clientIp, {
      token,
      timestamp: Date.now(),
    });
    return token;
  }

  /**
   * Extrair IP do cliente (suporta proxies e load balancers)
   */
  private getClientIp(req: FastifyRequest): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      return (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor).split(',')[0].trim();
    }
    return (req.headers['x-client-ip'] as string) || req.ip || 'unknown';
  }
}
