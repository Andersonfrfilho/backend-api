// log.provider.spec.ts

import { AuthLoginSessionUseCase } from '@modules/auth/use-cases/login-session/auth.login-session.use-cases';
import { AUTH_LOGIN_SESSION_USE_CASES_PROVIDE } from '@modules/auth/use-cases/login-session/auth.login-session.use-cases.interface';
import { Test, TestingModule } from '@nestjs/testing';

import {
  LOG_PROVIDER,
  LogProviderInterface,
} from '@modules/shared/infrastructure/providers/log/log.interface';

describe('AuthLoginSessionUseCase', () => {
  let authLoginSessionUseCase: AuthLoginSessionUseCase;
  let mockLogProvider: jest.Mocked<LogProviderInterface>;
  beforeEach(async () => {
    mockLogProvider = {
      setRequestId: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LogProviderInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOG_PROVIDER,
          useValue: mockLogProvider,
        },
        {
          provide: AUTH_LOGIN_SESSION_USE_CASES_PROVIDE,
          useClass: AuthLoginSessionUseCase,
        },
      ],
    }).compile();
    authLoginSessionUseCase = module.get<AuthLoginSessionUseCase>(
      AUTH_LOGIN_SESSION_USE_CASES_PROVIDE,
    );
  });

  it('should call info with "AuthLoginSessionUseCase"', async () => {
    await authLoginSessionUseCase.execute();
    expect(mockLogProvider.info).toHaveBeenCalledWith(
      'AuthLoginSessionUseCase',
    );
  });
});
