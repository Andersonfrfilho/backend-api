import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Security Headers Middleware
 * Adiciona headers de segurança obrigatórios em todas as respostas
 *
 * Headers implementados:
 * - X-Content-Type-Options: nosniff (previne MIME type sniffing)
 * - X-Frame-Options: DENY (previne clickjacking)
 * - X-XSS-Protection: 1; mode=block (proteção XSS para browsers antigos)
 * - Strict-Transport-Security: (HTTPS only)
 * - Content-Security-Policy: (restritiva por padrão)
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Previne MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Previne clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Proteção XSS para browsers antigos
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // HTTPS only (strict transport security)
    // Em produção: max-age deve ser bem grande (ex: 31536000 para 1 ano)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Content Security Policy - restritiva por padrão
    // Apenas permite resources do mesmo origin
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'",
    );

    // Referrer Policy - reduz informações vazadas
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Remove header padrão que expõe tecnologia
    res.removeHeader('X-Powered-By');

    next();
  }
}
