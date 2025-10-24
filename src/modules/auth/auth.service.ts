import { Inject, Injectable } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import { AUTH_LOGIN_SESSION_USE_CASES_PROVIDE } from './use-cases/login-session/auth.login-session.use-cases.interface';
import type { AuthLoginSessionUseCaseInterface } from './use-cases/use-cases.interface';
import {
  AuthServiceInterface,
  AuthServiceInterfaceLoginSessionServiceResponse,
} from './auth.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Inject(AUTH_LOGIN_SESSION_USE_CASES_PROVIDE)
    private readonly authLoginSessionUseCases: AuthLoginSessionUseCaseInterface,
  ) {}
  async loginSessionService(): Promise<AuthServiceInterfaceLoginSessionServiceResponse> {
    this.logProvider.info('loginSessionService');
    return this.authLoginSessionUseCases.execute();
  }
}
