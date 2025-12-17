import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthErrorFactory } from '@modules/auth/application/factories';
import { parseTokenWithRoles } from '@modules/auth/infrastructure/strategies/mock-jwt.strategy';

/**
 * JWT Authentication Guard
 * Protege rotas que requerem token Bearer
 *
 * Formato do token: "user-<role1>-<role2>"
 * Exemplo: "user-admin-moderator"
 *
 * Uso:
 * @UseGuards(JwtAuthGuard)
 * @Get('/protected-route')
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader) {
      throw AuthErrorFactory.missingAuthorizationHeader();
    }

    // Esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw AuthErrorFactory.invalidAuthorizationHeaderFormat();
    }

    const token = parts[1];

    try {
      // Parseia o token e extrai informações de usuário/roles
      const user = parseTokenWithRoles(token);
      request.user = user;
      return true;
    } catch {
      throw AuthErrorFactory.tokenInvalid();
    }
  }
}
