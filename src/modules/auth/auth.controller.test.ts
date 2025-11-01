import { Test, TestingModule } from '@nestjs/testing';

import {
  AUTH_SERVICE_PROVIDE,
  AuthServiceInterface,
} from '@modules/auth/auth.interface';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.interface';
import type { LogProviderInterface } from '@modules/shared/infrastructure/providers/log/log.interface';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let logProvider: jest.Mocked<LogProviderInterface>;
  let authService: jest.Mocked<AuthServiceInterface>;

  beforeEach(async () => {
    const logProviderMock = {
      info: jest.fn(),
    };

    const authServiceMock = {
      loginSessionService: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LOG_PROVIDER,
          useValue: logProviderMock,
        },
        {
          provide: AUTH_SERVICE_PROVIDE,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    logProvider = module.get(LOG_PROVIDER);
    authService = module.get(AUTH_SERVICE_PROVIDE);
  });

  describe('loginSession', () => {
    it('should call logProvider.info with AuthController', async () => {
      // Arrange
      const mockResponse = {
        sessionId: 'test-session',
      } as unknown as AuthServiceInterfaceLoginSessionServiceResponse;
      authService.loginSessionService.mockResolvedValue(mockResponse);

      // Act
      await controller.loginSession();

      // Assert
      expect(logProvider.info).toHaveBeenCalledWith('AuthController');
    });
    it('should call authService.loginSessionService', async () => {
      // Arrange
      const mockResponse = {
        sessionId: 'test-session',
      } as unknown as AuthServiceInterfaceLoginSessionServiceResponse;
      authService.loginSessionService.mockResolvedValue(mockResponse);

      // Act
      await controller.loginSession();

      // Assert
      expect(authService.loginSessionService).toHaveBeenCalled();
    });

    it('should return the loginSessionService response', async () => {
      // Arrange
      const mockResponse = {
        sessionId: 'test-session',
      } as unknown as AuthServiceInterfaceLoginSessionServiceResponse;
      authService.loginSessionService.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.loginSession();

      // Assert
      expect(result).toEqual(mockResponse);
    });
  });
});
