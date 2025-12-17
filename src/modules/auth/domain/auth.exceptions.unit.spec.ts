import { describe, expect, it } from '@jest/globals';
import {
  AuthBadRequestErrorValidationRequestDto,
  AuthLoginSessionServiceErrorInactiveDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
  AuthLoginSessionServiceInternalServerErrorDto,
  ERRORS_AUTH_LOGIN_SESSION,
  ERRORS_CODE_AUTH_LOGIN,
} from './auth.exceptions';

describe('Auth Exceptions - Unit Tests', () => {
  describe('DTOs', () => {
    it('should define AuthBadRequestErrorValidationRequestDto', () => {
      expect(AuthBadRequestErrorValidationRequestDto).toBeDefined();
    });

    it('should define AuthLoginSessionServiceInternalServerErrorDto', () => {
      expect(AuthLoginSessionServiceInternalServerErrorDto).toBeDefined();
    });

    it('should define AuthLoginSessionServiceErrorNotFoundDto', () => {
      const dto = new AuthLoginSessionServiceErrorNotFoundDto();
      expect(dto).toBeInstanceOf(AuthLoginSessionServiceErrorNotFoundDto);
    });

    it('should define AuthLoginSessionServiceErrorInactiveDto', () => {
      const dto = new AuthLoginSessionServiceErrorInactiveDto();
      expect(dto).toBeInstanceOf(AuthLoginSessionServiceErrorInactiveDto);
    });

    it('should define AuthLoginSessionServiceErrorInvalidCredentialsDto', () => {
      const dto = new AuthLoginSessionServiceErrorInvalidCredentialsDto();
      expect(dto).toBeInstanceOf(AuthLoginSessionServiceErrorInvalidCredentialsDto);
    });
  });

  describe('Error Codes', () => {
    it('should have MISSING_CREDENTIALS error code', () => {
      expect(ERRORS_CODE_AUTH_LOGIN.MISSING_CREDENTIALS).toBe('AUTH_LOGIN_001');
    });
  });

  describe('Error Configurations', () => {
    it('should have MISSING_CREDENTIALS error configuration', () => {
      const missingCredsError = ERRORS_AUTH_LOGIN_SESSION.MISSING_CREDENTIALS;
      expect(missingCredsError).toBeDefined();
      expect(missingCredsError.statusCode).toBe(400);
      expect(missingCredsError.message).toBe('Missing credentials');
      expect(missingCredsError.errorCode).toBe('AUTH_LOGIN_001');
    });

    it('should provide correct status code for missing credentials', () => {
      expect(ERRORS_AUTH_LOGIN_SESSION.MISSING_CREDENTIALS.statusCode).toBe(400);
    });
  });
});
