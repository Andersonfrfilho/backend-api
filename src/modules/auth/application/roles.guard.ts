import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppError, ErrorType } from '@modules/error';

import { ROLES_KEY } from './roles.decorator';

/**
 * Guard to check if user has required roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new AppError({
        type: ErrorType.AUTHORIZATION,
        message: 'User not authenticated or roles not available',
        statusCode: 403,
      });
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new AppError({
        type: ErrorType.AUTHORIZATION,
        message: 'Insufficient permissions',
        statusCode: 403,
      });
    }

    return true;
  }
}
