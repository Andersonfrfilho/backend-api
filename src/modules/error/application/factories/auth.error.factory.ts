import { BaseErrorFactory } from '@modules/error/application/factories/base.error.factory';
import { AUTH_ERROR_CONFIGS } from '@modules/error/domain/configs';

export class AuthErrorFactory extends BaseErrorFactory {
  static invalidCredentials() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.invalidCredentials());
  }

  static tokenExpired() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.tokenExpired());
  }

  static tokenInvalid() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.tokenInvalid());
  }

  static missingAuthorizationHeader() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.missingAuthorizationHeader());
  }

  static invalidAuthorizationHeaderFormat() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.invalidAuthorizationHeaderFormat());
  }

  static refreshTokenExpired() {
    return this.createAuthentication(AUTH_ERROR_CONFIGS.refreshTokenExpired());
  }

  static unauthorizedAccess(resource?: string) {
    return this.createAuthorization(AUTH_ERROR_CONFIGS.unauthorizedAccess(resource));
  }

  static insufficientPermissions(requiredRoles: string[]) {
    return this.createAuthorization(AUTH_ERROR_CONFIGS.insufficientPermissions(requiredRoles));
  }

  static userNotFoundInRequest() {
    return this.createAuthorization(AUTH_ERROR_CONFIGS.userNotFoundInRequest());
  }
}
