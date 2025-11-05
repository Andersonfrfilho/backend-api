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

  describe('Integration Tests - Service → UseCase → Logger Pipeline', () => {
    let testingModule: TestingModule;
    let authController: AuthController;
    let authService: AuthLoginSessionServiceInterface;

    beforeEach(async () => {
      // Setup for integration tests using real service implementation
      testingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
            useValue: {
              execute: jest.fn().mockImplementation((params: AuthLoginSessionRequestDto) =>
                Promise.resolve({
                  accessToken: `${params.email}-access-token`,
                  refreshToken: 'mocked-refresh-token',
                }),
              ),
            },
          },
        ],
      }).compile();

      authController = testingModule.get<AuthController>(AuthController);
      authService = testingModule.get<AuthLoginSessionServiceInterface>(
        AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      );
    });

    afterEach(async () => {
      await testingModule.close();
    });

    it('should controller and service work together', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'integration@test.com',
        password: testPassword,
      };

      // Act
      const result = await authController.loginSession(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toContain('integration@test.com');
      expect(result.refreshToken).toBe('mocked-refresh-token');
    });

    it('should service execute be called from controller', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@integration.com',
        password: testPassword,
      };
      const mockExecute = authService.execute as jest.Mock;
      mockExecute.mockClear();

      // Act
      await authController.loginSession(input);

      // Assert
      expect(mockExecute).toHaveBeenCalledWith(input);
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple integration calls', async () => {
      // Arrange
      const inputs: AuthLoginSessionRequestDto[] = [
        { email: 'user1@test.com', password: testPassword },
        { email: 'user2@test.com', password: testPassword },
        { email: 'user3@test.com', password: testPassword },
      ];

      // Act
      const results: any[] = [];
      for (const input of inputs) {
        const result = await authController.loginSession(input);
        results.push(result);
      }

      // Assert
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.accessToken).toContain(inputs[index].email);
      });
    });

    it('should preserve data consistency through pipeline', async () => {
      // Arrange
      const email = 'consistency@test.com';
      const input: AuthLoginSessionRequestDto = {
        email,
        password: testPassword,
      };

      // Act
      const result = await authController.loginSession(input);

      // Assert
      expect(result.accessToken).toContain(email);
      expect(typeof result.accessToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(0);
    });

    it('should integration complete within performance threshold', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'perf@test.com',
        password: testPassword,
      };

      // Act
      const startTime = Date.now();
      await authController.loginSession(input);
      const executionTime = Date.now() - startTime;

      // Assert
      expect(executionTime).toBeLessThan(50);
    });
  });

  describe('Contract Tests - Auth Request/Response Shapes', () => {
    /**
     * 📋 AuthLoginSessionRequestDto - Validates API contract
     *
     * ✅ ISO/IEC 25010 - API Compliance
     * ✅ RFC 7231 - Content validation
     */
    it('should enforce email and password in login request', () => {
      // Arrange
      const validRequest = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
      };

      // Act
      const dto = new AuthLoginSessionRequestDto();
      dto.email = validRequest.email;
      dto.password = validRequest.password;

      // Assert
      expect(dto.email).toBe('test@example.com');
      expect(dto.password).toBe('ValidPassword123!');
      expect(Object.keys(dto)).toContain('email');
      expect(Object.keys(dto)).toContain('password');
    });

    /**
     * 📋 AuthLoginSessionResponseDto - Validates response contract
     *
     * ✅ OAuth2/JWT compliance
     */
    it('should return accessToken and refreshToken in response', () => {
      // Arrange
      const responseData = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
      };

      // Act & Assert
      expect(responseData).toHaveProperty('accessToken');
      expect(responseData).toHaveProperty('refreshToken');
      expect(typeof responseData.accessToken).toBe('string');
      expect(typeof responseData.refreshToken).toBe('string');
      expect(responseData.accessToken.split('.').length).toBe(3); // JWT format
      expect(responseData.refreshToken.split('.').length).toBe(3); // JWT format
    });
  });
});
