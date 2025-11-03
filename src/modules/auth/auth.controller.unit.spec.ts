import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from '@jest/globals';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/domain/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import { AuthLoginSessionRequestDto } from '@modules/auth/shared/dtos';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController - Unit Tests', () => {
  let controller: AuthController;
  let service: AuthLoginSessionServiceInterface;
  let testPassword: string;

  beforeEach(async () => {
    // Arrange: Setup mocks and test module
    testPassword = faker.internet.password({ length: 12, memorable: false });
    const mockService = {
      execute: jest.fn().mockResolvedValue({
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      }),
    } as unknown as AuthLoginSessionServiceInterface;

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    service = moduleRef.get<AuthLoginSessionServiceInterface>(AUTH_LOGIN_SESSION_SERVICE_PROVIDE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginSession', () => {
    it('should be defined', () => {
      // Arrange
      // Nothing to arrange - testing controller existence

      // Act & Assert
      expect(controller).toBeDefined();
    });

    it('should call service.execute with request dto', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: testPassword,
      };

      // Act
      await controller.loginSession(input);

      // Assert
      const mockExecute = service.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalledWith(input);
    });

    it('should return login session response', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: testPassword,
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
        password: testPassword,
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
        password: testPassword,
      };
      const error = new Error('Service Error');
      const mockExecute = service.execute as jest.Mock;
      mockExecute.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.loginSession(input)).rejects.toThrow(error);
    });

    it('should handle multiple login requests', async () => {
      // Arrange
      const input1: AuthLoginSessionRequestDto = {
        email: 'user1@example.com',
        password: testPassword,
      };
      const input2: AuthLoginSessionRequestDto = {
        email: 'user2@example.com',
        password: testPassword,
      };

      // Act
      const result1 = await controller.loginSession(input1);
      const result2 = await controller.loginSession(input2);

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      const mockExecute = service.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalledTimes(2);
    });

    it('should return tokens with correct structure', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: testPassword,
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
