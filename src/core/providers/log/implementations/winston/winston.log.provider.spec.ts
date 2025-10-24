import { Test, TestingModule } from '@nestjs/testing';
import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';

describe('WinstonLogProvider (with real Winston)', () => {
  let provider: WinstonLogProvider;
  const mockWinston = {
    setRequestId: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WINSTON_LOG_PROVIDER,
          useValue: mockWinston,
        },
      ],
    }).compile();

    provider = module.get<WinstonLogProvider>(WINSTON_LOG_PROVIDER);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should log info with request ID', () => {
    provider.setRequestId('test-id');
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    provider.info('HELLO');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
