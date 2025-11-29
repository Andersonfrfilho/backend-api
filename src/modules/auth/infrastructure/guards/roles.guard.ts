import { ROLES_KEY } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Roles Guard - Valida se usuário possui roles necessários
 *
 * Funciona em conjunto com @Roles() decorator
 * Requer que JwtAuthGuard tenha sido aplicado primeiro
 *
 * Uso:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin', 'moderator')
 * @Delete('/user/:id')
 * async deleteUser() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtém roles especificadas no decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhum role foi especificado, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtém requisição
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário, nega acesso
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Obtém roles do usuário
    const userRoles = user.roles || [];

    // Valida se usuário possui algum dos roles necessários
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
