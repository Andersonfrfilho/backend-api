import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from '@core/providers/log/log.interface';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { LogProvider } from '@core/providers/log/log.provider';

describe('LogProvider', () => {
  let logProvider: LogProviderInterface;
  let mockWinston: jest.Mocked<WinstonLogProvider>;
  beforeEach(async () => {
    mockWinston = {
      setRequestId: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<WinstonLogProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WINSTON_LOG_PROVIDER,
          useValue: mockWinston,
        },
        {
          provide: LOG_PROVIDER,
          useClass: LogProvider,
        },
      ],
    }).compile();
    logProvider = module.get<LogProviderInterface>(LOG_PROVIDER);
  });

  it('should call setRequestId on winstonLogProvider', () => {
    logProvider.setRequestId('req-id');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWinston.setRequestId).toHaveBeenCalledWith('req-id');
  });

  it('should call info on winstonLogProvider', () => {
    logProvider.info({ msg: 'Hello' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWinston.info).toHaveBeenCalledWith({ msg: 'Hello' });
  });

  it('should call error on winstonLogProvider', () => {
    logProvider.error();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWinston.error).toHaveBeenCalled();
  });

  it('should call warn on winstonLogProvider', () => {
    logProvider.warn();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWinston.warn).toHaveBeenCalled();
  });

  it('should call debug on winstonLogProvider', () => {
    logProvider.debug();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWinston.debug).toHaveBeenCalled();
  });
});
