import { Test, TestingModule } from '@nestjs/testing';
import { LogProvider } from './log.provider';
import { WinstonLogProvider } from './implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from './implementations/winston/winston.log.provider.interface';

describe('LogProvider', () => {
  let logProvider: LogProvider;
  let mockWinstonLogProvider: jest.Mocked<WinstonLogProvider>;

  beforeEach(async () => {
    mockWinstonLogProvider = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogProvider,
        {
          provide: WINSTON_LOG_PROVIDER,
          useValue: mockWinstonLogProvider,
        },
      ],
    }).compile();

    logProvider = module.get<LogProvider>(LogProvider);
  });

  describe('info', () => {
    it('should call winstonLogProvider.info with correct params', () => {
      // Arrange
      const params = { message: 'test message', context: 'TestContext' };

      // Act
      logProvider.info(params);

      // Assert
      expect(mockWinstonLogProvider.info).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call winstonLogProvider.error with correct params', () => {
      // Arrange
      const params = { message: 'error message', context: 'TestContext' };

      // Act
      logProvider.error(params);

      // Assert
      expect(mockWinstonLogProvider.error).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should call winstonLogProvider.warn with correct params', () => {
      // Arrange
      const params = { message: 'warning message', context: 'TestContext' };

      // Act
      logProvider.warn(params);

      // Assert
      expect(mockWinstonLogProvider.warn).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should call winstonLogProvider.debug with correct params', () => {
      // Arrange
      const params = { message: 'debug message', context: 'TestContext' };

      // Act
      logProvider.debug(params);

      // Assert
      expect(mockWinstonLogProvider.debug).toHaveBeenCalled();
    });
  });
});
