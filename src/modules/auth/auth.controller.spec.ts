import { describe, it, expect, beforeEach } from '@jest/globals';
import { AuthController } from './auth.controller';
import { AuthLoginSessionRequestDto } from '@modules/auth/shared/dtos';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/domain/auth.login-session.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: AuthLoginSessionServiceInterface;

  beforeEach(() => {
    // Mock do Service sem usar TestingModule
    mockService = {
      execute: jest.fn().mockResolvedValue({
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      }),
    } as any;

    controller = new AuthController(mockService);
  });

  describe('loginSession', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call service.execute with request dto', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      await controller.loginSession(input);

      // Assert
      expect(mockService.execute).toHaveBeenCalledWith(input);
    });

    it('should return login session response', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = await controller.loginSession(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should handle valid email and password', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'user@domain.com',
        password: 'SecurePass@123',
      };

      // Act
      const result = await controller.loginSession(input);

      // Assert
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should propagate service errors', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };
      const error = new Error('Service Error');
      (mockService.execute as jest.Mock).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.loginSession(input)).rejects.toThrow(error);
    });

    it('should handle multiple login requests', async () => {
      // Arrange
      const input1: AuthLoginSessionRequestDto = {
        email: 'user1@example.com',
        password: 'Test@1234',
      };
      const input2: AuthLoginSessionRequestDto = {
        email: 'user2@example.com',
        password: 'Test@5678',
      };

      // Act
      const result1 = await controller.loginSession(input1);
      const result2 = await controller.loginSession(input2);

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(mockService.execute).toHaveBeenCalledTimes(2);
    });

    it('should return tokens with correct structure', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = await controller.loginSession(input);

      // Assert
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.refreshToken.length).toBeGreaterThan(0);
    });
  });
});
