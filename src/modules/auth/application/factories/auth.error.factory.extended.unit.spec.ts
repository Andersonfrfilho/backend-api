import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { AuthErrorFactory } from './auth.error.factory';

describe('AuthErrorFactory - Extended Coverage - Unit Tests', () => {
  describe('invalidCredentials', () => {
    it('should create authentication error', () => {
      const error = AuthErrorFactory.invalidCredentials();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });

    it('should have authentication error code', () => {
      const error = AuthErrorFactory.invalidCredentials();
      expect(error).toHaveProperty('code');
    });
  });

  describe('tokenExpired', () => {
    it('should create authentication error for expired token', () => {
      const error = AuthErrorFactory.tokenExpired();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('tokenInvalid', () => {
    it('should create authentication error for invalid token', () => {
      const error = AuthErrorFactory.tokenInvalid();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('missingAuthorizationHeader', () => {
    it('should create authentication error for missing header', () => {
      const error = AuthErrorFactory.missingAuthorizationHeader();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('invalidAuthorizationHeaderFormat', () => {
    it('should create authentication error for invalid header format', () => {
      const error = AuthErrorFactory.invalidAuthorizationHeaderFormat();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('refreshTokenExpired', () => {
    it('should create authentication error for expired refresh token', () => {
      const error = AuthErrorFactory.refreshTokenExpired();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('unauthorizedAccess', () => {
    it('should create authorization error without resource', () => {
      const error = AuthErrorFactory.unauthorizedAccess();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });

    it('should create authorization error with resource', () => {
      const resource = 'user-profile';
      const error = AuthErrorFactory.unauthorizedAccess(resource);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });

    it('should handle various resource names', () => {
      const resources = ['user-profile', 'admin-panel', 'settings', 'api-key'];
      resources.forEach((resource) => {
        const error = AuthErrorFactory.unauthorizedAccess(resource);
        expect(error.statusCode).toBe(403);
      });
    });
  });

  describe('insufficientPermissions', () => {
    it('should create authorization error for insufficient permissions', () => {
      const requiredRoles = ['ADMIN', 'MODERATOR'];
      const error = AuthErrorFactory.insufficientPermissions(requiredRoles);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });

    it('should handle single role requirement', () => {
      const requiredRoles = ['ADMIN'];
      const error = AuthErrorFactory.insufficientPermissions(requiredRoles);
      expect(error.statusCode).toBe(403);
    });

    it('should handle multiple role requirements', () => {
      const requiredRoles = ['ADMIN', 'MODERATOR', 'EDITOR'];
      const error = AuthErrorFactory.insufficientPermissions(requiredRoles);
      expect(error.statusCode).toBe(403);
    });
  });

  describe('userNotFoundInRequest', () => {
    it('should create authorization error when user not found in request', () => {
      const error = AuthErrorFactory.userNotFoundInRequest();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
    });
  });

  describe('error differentiation', () => {
    it('should differentiate between authentication and authorization errors', () => {
      const authError = AuthErrorFactory.invalidCredentials();
      const authzError = AuthErrorFactory.unauthorizedAccess();

      expect(authError.statusCode).toBe(401);
      expect(authzError.statusCode).toBe(403);
    });

    it('all errors should have message property', () => {
      const errors = [
        AuthErrorFactory.invalidCredentials(),
        AuthErrorFactory.tokenExpired(),
        AuthErrorFactory.unauthorizedAccess('resource'),
        AuthErrorFactory.insufficientPermissions(['ADMIN']),
      ];

      errors.forEach((error) => {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      });
    });
  });
});
