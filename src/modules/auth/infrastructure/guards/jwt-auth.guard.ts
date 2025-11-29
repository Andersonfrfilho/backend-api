import { parseTokenWithRoles } from '@modules/auth/infrastructure/strategies/mock-jwt.strategy';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

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
      throw new UnauthorizedException('Missing authorization header');
    }

    // Esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];

    try {
      // Parseia o token e extrai informações de usuário/roles
      const user = parseTokenWithRoles(token);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
