import { Inject, Injectable } from '@nestjs/common';

import {
  AuthLoginSessionServiceInterface,
  AuthLoginSessionServiceParams,
  AuthLoginSessionServiceResponse,
} from '@modules/auth/services/login-session/auth.login-session.interface';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.interface';
import type { LogProviderInterface } from '@modules/shared/infrastructure/providers/log/log.interface';

@Injectable()
export class AuthLoginSessionService
  implements AuthLoginSessionServiceInterface
{
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
  ) {}
  execute(
    params: AuthLoginSessionServiceParams,
  ): Promise<AuthLoginSessionServiceResponse> {
    this.logProvider.info({
      context: 'AuthLoginSessionUseCase',
      params,
    });
    const response: AuthLoginSessionServiceResponse = {
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    };
    return Promise.resolve(response);
  }
}
