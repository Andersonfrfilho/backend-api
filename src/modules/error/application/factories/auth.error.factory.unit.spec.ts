import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { AuthErrorFactory } from './auth.error.factory';

describe('AuthErrorFactory - Unit Tests', () => {
  describe('invalidCredentials', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.invalidCredentials();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });

    it('should have correct error type', () => {
      const error = AuthErrorFactory.invalidCredentials();
      expect(error.type).toBe('AUTHENTICATION');
    });
  });

  describe('tokenExpired', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.tokenExpired();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('tokenInvalid', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.tokenInvalid();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('missingAuthorizationHeader', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.missingAuthorizationHeader();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('invalidAuthorizationHeaderFormat', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.invalidAuthorizationHeaderFormat();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('refreshTokenExpired', () => {
    it('should create an authentication error', () => {
      const error = AuthErrorFactory.refreshTokenExpired();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('unauthorizedAccess', () => {
    it('should create an authorization error', () => {
      const error = AuthErrorFactory.unauthorizedAccess();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });

    it('should create an authorization error with resource', () => {
      const error = AuthErrorFactory.unauthorizedAccess('user-profile');
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });
  });

  describe('insufficientPermissions', () => {
    it('should create an authorization error', () => {
      const error = AuthErrorFactory.insufficientPermissions(['admin']);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });

    it('should create an authorization error with multiple roles', () => {
      const error = AuthErrorFactory.insufficientPermissions(['admin', 'manager']);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });
  });

  describe('userNotFoundInRequest', () => {
    it('should create an authorization error', () => {
      const error = AuthErrorFactory.userNotFoundInRequest();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });
  });
});
