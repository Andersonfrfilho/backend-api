import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para especificar roles necessários em uma rota
 *
 * Uso:
 * @Roles('admin', 'moderator')
 * @Get('/delete-user')
 * async deleteUser() { ... }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
