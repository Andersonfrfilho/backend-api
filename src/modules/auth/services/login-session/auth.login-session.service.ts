import { Inject, Injectable } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  AuthLoginSessionServiceInterface,
  AuthLoginSessionServiceParams,
  AuthLoginSessionServiceResponse,
} from './auth.login-session.interface';

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
