import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { AppError, ErrorType } from '@modules/error';
import { JwtProvider } from '@modules/shared/infrastructure/providers/jwt/jwt.provider';

/**
 * JWT Authentication Guard for protecting routes
 * Uses our custom JWT provider instead of Passport
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtProvider: JwtProvider,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: 'No token provided',
        statusCode: 401,
      });
    }

    try {
      // Verify and decode the JWT token
      const payload = this.jwtProvider.verify(token);

      // Attach user info to request
      request.user = payload;
      return true;
    } catch (error) {
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: 'Invalid or expired token',
        statusCode: 401,
      });
    }
  }

  /**
   * Extract token from Authorization header
   */
  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
