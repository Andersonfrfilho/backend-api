// log.provider.spec.ts

import { WinstonLogProvider } from './providers/winston.log.provider';
import { LOG_PROVIDER, LogProviderInterface } from './log.interface';
import { WINSTON_LOG_PROVIDER } from './providers/winston.log.provider.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { LogProvider } from './log.service';

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
    expect(mockWinston.setRequestId).toHaveBeenCalledWith('req-id');
  });

  it('should call info on winstonLogProvider', () => {
    logProvider.info({ msg: 'Hello' });
    expect(mockWinston.info).toHaveBeenCalledWith({ msg: 'Hello' });
  });

  it('should call error on winstonLogProvider', () => {
    logProvider.error();
    expect(mockWinston.error).toHaveBeenCalled();
  });

  it('should call warn on winstonLogProvider', () => {
    logProvider.warn();
    expect(mockWinston.warn).toHaveBeenCalled();
  });

  it('should call debug on winstonLogProvider', () => {
    logProvider.debug();
    expect(mockWinston.debug).toHaveBeenCalled();
  });
});
