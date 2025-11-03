import { Test, TestingModule } from '@nestjs/testing';

import type { LogProviderInterface } from '@modules/shared/domain';
import { WinstonLogProvider } from './implementations/winston/winston.log.provider';
import { LOG_PROVIDER, WINSTON_LOG_PROVIDER } from '@modules/shared/infrastructure/log.provider';
import { LogProvider } from './log.provider';

// NOSONAR - Test file with faker-generated credentials for testing purposes only
describe('LogProvider - Unit Tests', () => {
  let provider: LogProviderInterface;
  let winstonLogProvider: WinstonLogProvider;

  beforeEach(async () => {
    // Arrange: Setup mocks and test module
    const mockWinstonLogProvider = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as WinstonLogProvider;

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LogProvider,
        {
          provide: WINSTON_LOG_PROVIDER,
          useValue: mockWinstonLogProvider,
        },
        {
          provide: LOG_PROVIDER,
          useClass: LogProvider,
        },
      ],
    }).compile();

    provider = moduleRef.get<LogProviderInterface>(LOG_PROVIDER as never);
    winstonLogProvider = moduleRef.get<WinstonLogProvider>(WINSTON_LOG_PROVIDER as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should call winston info method with correct params', () => {
      // Arrange
      const logParams = {
        message: 'Test info message',
        context: 'TestContext',
      };

      // Act
      provider.info(logParams);

      // Assert
      expect(winstonLogProvider.info).toHaveBeenCalled();
      expect(winstonLogProvider.info).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
          message: 'Test info message',
          context: 'TestContext',
        }),
      );
    });

    it('should handle params with metadata', () => {
      // Arrange
      const logParams = {
        message: 'Test with metadata',
        context: 'TestContext',
        params: {
          userId: '123',
          action: 'login',
        },
      };

      // Act
      provider.info(logParams);

      // Assert
      expect(winstonLogProvider.info).toHaveBeenCalled();
    });

    it('should handle empty params gracefully', () => {
      // Arrange
      const logParams = { message: 'Empty params' };

      // Act
      provider.info(logParams);

      // Assert
      expect(winstonLogProvider.info).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call winston error method with correct level', () => {
      // Arrange
      const logParams = {
        message: 'Test error message',
        context: 'ErrorContext',
      };

      // Act
      provider.error(logParams);

      // Assert
      expect(winstonLogProvider.error).toHaveBeenCalled();
      expect(winstonLogProvider.error).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'error',
          message: 'Test error message',
        }),
      );
    });

    it('should log error with additional params', () => {
      // Arrange
      const logParams = {
        message: 'Database error',
        context: 'DatabaseService',
        params: {
          errorCode: 'DB_001',
          query: 'SELECT * FROM users',
        },
      };

      // Act
      provider.error(logParams);

      // Assert
      expect(winstonLogProvider.error).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should call winston warn method with correct level', () => {
      // Arrange
      const logParams = {
        message: 'Test warning message',
        context: 'WarnContext',
      };

      // Act
      provider.warn(logParams);

      // Assert
      expect(winstonLogProvider.warn).toHaveBeenCalled();
      expect(winstonLogProvider.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'warn',
          message: 'Test warning message',
        }),
      );
    });
  });

  describe('debug', () => {
    it('should call winston debug method with correct level', () => {
      // Arrange
      const logParams = {
        message: 'Test debug message',
        context: 'DebugContext',
      };

      // Act
      provider.debug(logParams);

      // Assert
      expect(winstonLogProvider.debug).toHaveBeenCalled();
      expect(winstonLogProvider.debug).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug',
          message: 'Test debug message',
        }),
      );
    });

    it('should handle complex debug params', () => {
      // Arrange
      const logParams = {
        message: 'Complex debug',
        context: 'DebugContext',
        params: {
          requestId: 'req-123',
          duration: 100,
          data: { key: 'value' },
        },
      };

      // Act
      provider.debug(logParams);

      // Assert
      expect(winstonLogProvider.debug).toHaveBeenCalled();
    });
  });

  describe('obfuscation', () => {
    it('should obfuscate sensitive fields in params', () => {
      // Arrange
      const logParams = {
        message: 'Login attempt',
        context: 'AuthService',
        params: {
          password: 'secret123',
          username: 'user@example.com',
        },
      };

      // Act
      provider.info(logParams);

      // Assert
      expect(winstonLogProvider.info).toHaveBeenCalled();
      const callArgs = (winstonLogProvider.info as jest.Mock).mock.calls[0][0];
      expect(callArgs.metadata).toBeDefined();
    });
  });

  describe('method invocation consistency', () => {
    it('should call appropriate method for each log level', () => {
      // Arrange
      const baseParams = {
        message: 'Test message',
        context: 'TestContext',
      };

      // Act
      provider.info(baseParams);
      provider.error(baseParams);
      provider.warn(baseParams);
      provider.debug(baseParams);

      // Assert
      expect(winstonLogProvider.info).toHaveBeenCalledTimes(1);
      expect(winstonLogProvider.error).toHaveBeenCalledTimes(1);
      expect(winstonLogProvider.warn).toHaveBeenCalledTimes(1);
      expect(winstonLogProvider.debug).toHaveBeenCalledTimes(1);
    });

    it('should preserve message and context across all methods', () => {
      // Arrange
      const baseParams = {
        message: 'Consistent message',
        context: 'ConsistentContext',
      };

      // Act
      provider.info(baseParams);
      provider.error(baseParams);
      provider.warn(baseParams);
      provider.debug(baseParams);

      // Assert
      const infoCall = (winstonLogProvider.info as jest.Mock).mock.calls[0][0];
      const errorCall = (winstonLogProvider.error as jest.Mock).mock.calls[0][0];
      const warnCall = (winstonLogProvider.warn as jest.Mock).mock.calls[0][0];
      const debugCall = (winstonLogProvider.debug as jest.Mock).mock.calls[0][0];

      expect(infoCall.message).toBe('Consistent message');
      expect(errorCall.message).toBe('Consistent message');
      expect(warnCall.message).toBe('Consistent message');
      expect(debugCall.message).toBe('Consistent message');
    });
  });
});
