import type {
  AuthenticationErrorConfig,
  AuthorizationErrorConfig,
} from '@modules/error/domain/configs/error-config.interface';
import { AuthErrorCode } from '@modules/error/domain/error-codes';

export const AUTH_ERROR_CONFIGS = {
  invalidCredentials: (): AuthenticationErrorConfig => ({
    message: 'Invalid credentials',
    code: AuthErrorCode.INVALID_CREDENTIALS,
  }),

  tokenExpired: (): AuthenticationErrorConfig => ({
    message: 'Token has expired',
    code: AuthErrorCode.TOKEN_EXPIRED,
  }),

  tokenInvalid: (): AuthenticationErrorConfig => ({
    message: 'Invalid token',
    code: AuthErrorCode.TOKEN_INVALID,
  }),

  missingAuthorizationHeader: (): AuthenticationErrorConfig => ({
    message: 'Missing authorization header',
    code: AuthErrorCode.TOKEN_INVALID,
  }),

  invalidAuthorizationHeaderFormat: (): AuthenticationErrorConfig => ({
    message: 'Invalid authorization header format',
    code: AuthErrorCode.TOKEN_INVALID,
  }),

  refreshTokenExpired: (): AuthenticationErrorConfig => ({
    message: 'Refresh token has expired',
    code: AuthErrorCode.REFRESH_TOKEN_EXPIRED,
  }),

  unauthorizedAccess: (resource?: string): AuthorizationErrorConfig => ({
    message: `Unauthorized access to ${resource || 'this resource'}`,
    code: AuthErrorCode.UNAUTHORIZED_ACCESS,
  }),

  insufficientPermissions: (requiredRoles: string[]): AuthorizationErrorConfig => ({
    message: `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
    code: AuthErrorCode.UNAUTHORIZED_ACCESS,
    details: { requiredRoles },
  }),

  userNotFoundInRequest: (): AuthorizationErrorConfig => ({
    message: 'User not found in request',
    code: AuthErrorCode.UNAUTHORIZED_ACCESS,
  }),
} as const;
