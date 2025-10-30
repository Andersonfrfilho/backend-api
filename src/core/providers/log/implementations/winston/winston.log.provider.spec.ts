import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { WinstonLogProvider } from './winston.log.provider';
import { requestContext } from '@app/core/context/request-context';

jest.mock('@app/core/context/request-context');

describe('WinstonLogProvider', () => {
  let provider: WinstonLogProvider;
  let mockLogger: any;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinstonLogProvider,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    provider = module.get<WinstonLogProvider>(WinstonLogProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should call loggerWinston.log with params and requestId', () => {
      // Arrange
      const params = { message: 'test message', level: 'info' };
      const requestId = 'req-123';

      (requestContext.getStore as jest.Mock).mockReturnValue({ requestId });

      // Act
      provider.info(params);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith({
        ...params,
        requestId,
      });
    });

    it('should call loggerWinston.log with empty requestId when store is undefined', () => {
      // Arrange
      const params = { message: 'test message', level: 'info' };

      (requestContext.getStore as jest.Mock).mockReturnValue(undefined);

      // Act
      provider.info(params);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith({
        ...params,
        requestId: '',
      });
    });

    it('should call loggerWinston.log with empty requestId when store exists but requestId is falsy', () => {
      // Arrange
      const params = { message: 'test message', level: 'info' };

      (requestContext.getStore as jest.Mock).mockReturnValue({
        requestId: null,
      });

      // Act
      provider.info(params);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith({
        ...params,
        requestId: '',
      });
    });
  });

  describe('error', () => {
    it('should call loggerWinston.error with params and requestId', () => {
      // Arrange
      const params = { message: 'error message', level: 'error' };
      const requestId = 'req-456';

      (requestContext.getStore as jest.Mock).mockReturnValue({ requestId });

      // Act
      provider.error(params);

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith({
        ...params,
        requestId,
      });
    });
  });

  describe('warn', () => {
    it('should call loggerWinston.warn with params and requestId', () => {
      // Arrange
      const params = { message: 'warning message', level: 'warn' };
      const requestId = 'req-789';

      (requestContext.getStore as jest.Mock).mockReturnValue({ requestId });

      // Act
      provider.warn(params);

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith({
        ...params,
        requestId,
      });
    });
  });

  describe('debug', () => {
    it('should call loggerWinston.log with debug level and params and requestId', () => {
      // Arrange
      const params = { message: 'debug message', level: 'debug' };
      const requestId = 'req-999';

      (requestContext.getStore as jest.Mock).mockReturnValue({ requestId });

      // Act
      provider.debug(params);

      // Assert
      expect(mockLogger.log).toHaveBeenCalledWith({
        ...params,
        level: 'debug',
        requestId,
      });
    });
  });
});
