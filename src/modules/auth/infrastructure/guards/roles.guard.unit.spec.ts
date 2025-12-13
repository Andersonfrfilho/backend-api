import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard - Unit Tests', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockContext: Partial<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    mockRequest = {
      user: {
        roles: ['user'],
      },
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
      expect(guard.canActivate).toBeDefined();
    });

    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when required roles array is empty', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw error when user is not found in request', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = undefined;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw error when user has no roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: undefined };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['admin'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'moderator']);
      mockRequest.user = { roles: ['moderator'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has multiple roles including required one', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['user', 'admin', 'moderator'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw error when user lacks required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['user'] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw error when user lacks all required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(['admin', 'moderator', 'superuser']);
      mockRequest.user = { roles: ['user'] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle case-sensitive role matching', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['Admin']);
      mockRequest.user = { roles: ['admin'] };

      // Case-sensitive, so should throw
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should call reflector with correct ROLES_KEY', () => {
      const spy = jest.spyOn(reflector, 'getAllAndOverride');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      guard.canActivate(mockContext as ExecutionContext);

      expect(spy).toHaveBeenCalledWith(ROLES_KEY, expect.any(Array));
    });
  });

  describe('Metadata retrieval', () => {
    it('should retrieve roles from handler', () => {
      const mockHandler = {};
      const mockClass = {};

      (mockContext.getHandler as jest.Mock).mockReturnValue(mockHandler);
      (mockContext.getClass as jest.Mock).mockReturnValue(mockClass);

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      guard.canActivate(mockContext as ExecutionContext);

      expect(mockContext.getHandler).toHaveBeenCalled();
      expect(mockContext.getClass).toHaveBeenCalled();
    });

    it('should prioritize handler metadata over class metadata', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['handler-role']);
      mockRequest.user = { roles: ['handler-role'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('Role validation scenarios', () => {
    it('should allow admin role when admin is required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['admin'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow user role when user is required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);
      mockRequest.user = { roles: ['user'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should deny when required role is missing', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'superuser']);
      mockRequest.user = { roles: ['user'] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should handle empty user roles array', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: [] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should match roles exactly', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['administrator'] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });
  });

  describe('Error messages', () => {
    it('should throw descriptive error for missing user', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = null;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });

    it('should throw descriptive error for insufficient permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin', 'superuser']);
      mockRequest.user = { roles: ['user'] };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle single required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: ['admin'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle many required roles', () => {
      const requiredRoles = Array.from({ length: 100 }, (_, i) => `role-${i}`);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
      mockRequest.user = { roles: ['role-50'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle roles with special characters', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(['admin-super', 'user_read', 'post.delete']);
      mockRequest.user = { roles: ['admin-super'] };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should handle null roles array gracefully', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      mockRequest.user = { roles: null };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow();
    });
  });
});
