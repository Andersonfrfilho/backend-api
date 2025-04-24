import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from 'src/providers/log/log.interface';
import {
  AUTH_SERVICE_PROVIDE,
  AuthServiceInterface,
  AuthServiceInterfaceLoginSessionServiceResponse,
} from './auth.interface';

@Injectable()
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface,
    @Inject(AUTH_SERVICE_PROVIDE) private authService: AuthServiceInterface,
  ) {}

  @Get('/login-session')
  loginSession(): Promise<AuthServiceInterfaceLoginSessionServiceResponse> {
    this.logProvider.info('AuthController');
    return this.authService.loginSessionService();
  }
}
