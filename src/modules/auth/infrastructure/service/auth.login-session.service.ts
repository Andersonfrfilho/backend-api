import { Inject, Injectable } from '@nestjs/common';

import type {
  AuthLoginSessionServiceInterface,
  AuthLoginSessionUseCaseInterface,
} from '@modules/auth/domain/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import {
  AuthLoginSessionRequestDto as AuthLoginSessionRequestServiceParams,
  AuthLoginSessionResponseDto as AuthLoginSessionResponseServiceParams,
} from '@modules/auth/shared/dtos';
import {
  LOG_PROVIDER,
  type LogProviderInterface,
} from '@modules/shared/infrastructure/providers/log/log.interface';

@Injectable()
export class AuthLoginSessionService implements AuthLoginSessionServiceInterface {
  @Inject(LOG_PROVIDER) private readonly loggerProvider: LogProviderInterface;
  @Inject(AUTH_LOGIN_SESSION_USE_CASE_PROVIDE)
  private readonly authLoginSessionUseCase: AuthLoginSessionUseCaseInterface;

  async execute(
    params: AuthLoginSessionRequestServiceParams,
  ): Promise<AuthLoginSessionResponseServiceParams> {
    this.loggerProvider.info({
      message: 'Executing login session service',
      context: 'AuthLoginSessionService - execute',
      params,
    });
    return this.authLoginSessionUseCase.execute(params);
  }
}
