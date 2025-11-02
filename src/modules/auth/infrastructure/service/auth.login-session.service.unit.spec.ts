import { beforeEach, describe, expect, it } from '@jest/globals';
import type { AuthLoginSessionUseCaseInterface } from '@modules/auth/domain/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import { AuthLoginSessionRequestDto } from '@modules/auth/shared/dtos';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoginSessionService } from './auth.login-session.service';

describe('AuthLoginSessionService - Unit Tests', () => {
  let service: AuthLoginSessionService;
  let useCase: AuthLoginSessionUseCaseInterface;
  let logProvider: any;

  beforeEach(async () => {
    // Arrange: Setup mocks and test module
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue({
        accessToken: 'mocked-token',
        refreshToken: 'mocked-refresh',
      }),
    } as unknown as AuthLoginSessionUseCaseInterface;

    const mockLogProvider = {
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLoginSessionService,
        {
          provide: AUTH_LOGIN_SESSION_USE_CASE_PROVIDE,
          useValue: mockUseCase,
        },
        {
          provide: LOG_PROVIDER,
          useValue: mockLogProvider,
        },
      ],
    }).compile();

    service = module.get<AuthLoginSessionService>(AuthLoginSessionService);
    useCase = module.get(AUTH_LOGIN_SESSION_USE_CASE_PROVIDE);
    logProvider = module.get(LOG_PROVIDER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should be defined', () => {
      // Arrange
      // Nothing to arrange - testing service existence

      // Act & Assert
      expect(service).toBeDefined();
    });

    it('should call logProvider.info', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      await service.execute(input);

      // Assert
      expect(logProvider.info).toHaveBeenCalled();
    });

    it('should call useCase.execute with params', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      await service.execute(input);

      // Assert
      const mockExecute = useCase.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalledWith(input);
    });

    it('should return useCase response', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      const result = await service.execute(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should propagate useCase errors', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };
      const error = new Error('UseCase Error');
      const mockExecute = useCase.execute as jest.Mock;
      mockExecute.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(service.execute(input)).rejects.toThrow(error);
    });

    it('should log with correct context', async () => {
      // Arrange
      const input: AuthLoginSessionRequestDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      // Act
      await service.execute(input);

      // Assert
      expect(logProvider.info).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.stringContaining('AuthLoginSessionService'),
        }),
      );
    });

    it('should handle multiple calls', async () => {
      // Arrange
      const input1: AuthLoginSessionRequestDto = {
        email: 'user1@example.com',
        password: 'Test@1234',
      };
      const input2: AuthLoginSessionRequestDto = {
        email: 'user2@example.com',
        password: 'Test@1234',
      };

      // Act
      const result1 = await service.execute(input1);
      const result2 = await service.execute(input2);

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      const mockExecute = useCase.execute as jest.Mock;
      expect(mockExecute).toHaveBeenCalledTimes(2);
    });
  });
});
