import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import { AUTH_SERVICE_PROVIDE } from '@modules/auth/auth.interface';
import type {
  AuthServiceInterface,
  AuthServiceInterfaceLoginSessionServiceResponse,
} from '@modules/auth/auth.interface';

@Injectable()
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Inject(AUTH_SERVICE_PROVIDE)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Get('/login-session')
  loginSession(): Promise<AuthServiceInterfaceLoginSessionServiceResponse> {
    this.logProvider.info('AuthController');
    return this.authService.loginSessionService();
  }
}
