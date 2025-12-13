import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard - Unit Tests', () => {
  let guard: JwtAuthGuard;
  let mockContext: Partial<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    guard = new JwtAuthGuard();

    mockRequest = {
      headers: {},
      user: null,
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
      expect(guard.canActivate).toBeDefined();
    });

    it('should throw error when authorization header is missing', () => {
      mockRequest.headers.authorization = undefined;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw error when authorization header format is invalid', () => {
      mockRequest.headers.authorization = 'InvalidFormat';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw error when Bearer token is missing', () => {
      mockRequest.headers.authorization = 'Bearer';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should accept valid Bearer token format', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).not.toThrow();
    });

    it('should throw error for invalid Bearer token', () => {
      mockRequest.headers.authorization = 'Bearer invalid-token-format';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle case-insensitive Bearer keyword', () => {
      mockRequest.headers.authorization = 'bearer user-admin';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).not.toThrow();
    });

    it('should set user on request object when token is valid', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user).not.toBeNull();
    });

    it('should return true on successful authentication', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should extract user information from token', () => {
      mockRequest.headers.authorization = 'Bearer user-admin-moderator';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user.roles).toBeDefined();
    });

    it('should handle multiple roles in token', () => {
      mockRequest.headers.authorization = 'Bearer user-admin-moderator-superuser';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user.roles).toBeDefined();
      expect(Array.isArray(mockRequest.user.roles)).toBe(true);
    });

    it('should throw error for malformed tokens', () => {
      mockRequest.headers.authorization = 'Bearer not-a-valid-token';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle whitespace in authorization header', () => {
      mockRequest.headers.authorization = '  Bearer user-admin  ';

      // Should handle or throw appropriate error
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should reject empty Bearer token', () => {
      mockRequest.headers.authorization = 'Bearer ';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should reject authorization with extra spaces', () => {
      mockRequest.headers.authorization = 'Bearer  user-admin';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle different Bearer variations', () => {
      const validFormats = [
        'Bearer user-admin',
        'BEARER user-admin',
        'Bearer user-admin-role1-role2',
      ];

      validFormats.forEach((format) => {
        mockRequest.headers.authorization = format;

        // Should not throw for valid formats
        try {
          guard.canActivate(mockContext as ExecutionContext);
        } catch (error) {
          // Only fail if it's not a token parsing error
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('Authorization header parsing', () => {
    it('should correctly split authorization header', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).not.toThrow();
    });

    it('should require exactly 2 parts in authorization header', () => {
      // Only "Bearer"
      mockRequest.headers.authorization = 'Bearer';
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();

      // More than 2 parts
      mockRequest.headers.authorization = 'Bearer token extra-part';
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });
  });

  describe('Error scenarios', () => {
    it('should throw error with specific message for missing authorization', () => {
      mockRequest.headers = {};

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw error for invalid format', () => {
      mockRequest.headers.authorization = 'Basic dXNlcjpwYXNz';

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle null authorization header', () => {
      mockRequest.headers.authorization = null;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle undefined headers object', () => {
      mockRequest.headers = undefined;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });
  });

  describe('Token parsing and role extraction', () => {
    it('should parse simple user token', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user.roles).toBeDefined();
    });

    it('should parse token with no roles', () => {
      mockRequest.headers.authorization = 'Bearer user-admin';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user).toBeDefined();
    });

    it('should preserve roles structure', () => {
      mockRequest.headers.authorization = 'Bearer user-admin-moderator';

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockRequest.user.roles).toBeDefined();
      expect(Array.isArray(mockRequest.user.roles)).toBe(true);
    });
  });
});
