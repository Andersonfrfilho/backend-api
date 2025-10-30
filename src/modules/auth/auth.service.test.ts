import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import { AUTH_LOGIN_SESSION_USE_CASES_PROVIDE } from './use-cases/login-session/auth.login-session.use-cases.interface';

describe('AuthService', () => {
  let service: AuthService;
  let mockLogProvider: { info: jest.Mock };
  let mockAuthLoginSessionUseCases: { execute: jest.Mock };

  beforeEach(async () => {
    mockLogProvider = {
      info: jest.fn(),
    };

    mockAuthLoginSessionUseCases = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: LOG_PROVIDER,
          useValue: mockLogProvider,
        },
        {
          provide: AUTH_LOGIN_SESSION_USE_CASES_PROVIDE,
          useValue: mockAuthLoginSessionUseCases,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('loginSessionService', () => {
    it('should call logProvider.info with correct message', async () => {
      // Arrange
      mockAuthLoginSessionUseCases.execute.mockResolvedValue({
        sessionId: '123',
      });

      // Act
      await service.loginSessionService();

      // Assert
      expect(mockLogProvider.info).toHaveBeenCalledWith('loginSessionService');
    });

    it('should call authLoginSessionUseCases.execute', async () => {
      // Arrange
      mockAuthLoginSessionUseCases.execute.mockResolvedValue({
        sessionId: '123',
      });

      // Act
      await service.loginSessionService();

      // Assert
      expect(mockAuthLoginSessionUseCases.execute).toHaveBeenCalled();
    });

    it('should return result from authLoginSessionUseCases.execute', async () => {
      // Arrange
      const expectedResult = { sessionId: '123' };
      mockAuthLoginSessionUseCases.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await service.loginSessionService();

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
