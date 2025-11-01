import { Inject } from '@nestjs/common';

import {
  LOG_PROVIDER,
  type LogProviderInterface,
} from '@app/modules/shared/infrastructure/providers/log/log.interface';

import { AuthLoginSessionServiceRequestDto } from '../../application/dtos/LoginSessionRequest.dto';
import { AuthLoginSessionServiceResponseDto } from '../../application/dtos/LoginSessionResponse.dto';
import { AuthLoginSessionServiceInterface } from '../../auth.interface';
import type { AuthLoginSessionUseCaseInterface } from '../../domain/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '../auth.provider';

export class AuthLoginSessionService implements AuthLoginSessionServiceInterface {
  @Inject(LOG_PROVIDER) private readonly loggerProvider: LogProviderInterface;
  @Inject(AUTH_LOGIN_SESSION_USE_CASE_PROVIDE)
  private readonly authLoginSessionUseCase: AuthLoginSessionUseCaseInterface;

  async execute(
    params: AuthLoginSessionServiceRequestDto,
  ): Promise<AuthLoginSessionServiceResponseDto> {
    this.loggerProvider.info({
      context: 'AuthLoginSessionService - execute',
      params,
    });
    return this.authLoginSessionUseCase.execute(params);
  }
}
