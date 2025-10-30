import { Body, Controller, Get, Inject, Injectable } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import type {
  AuthLoginSessionControllerParams,
  AuthLoginSessionControllerResponse,
} from '@modules/auth/auth.interface';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from './services/login-session/auth.login-session.interface';
import type { AuthLoginSessionServiceInterface } from './services/login-session/auth.login-session.interface';
import {
  AuthLoginSessionParamsDto,
  AuthLoginSessionResponseDto,
} from './services/login-session/auth.login-session.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Injectable()
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Inject(AUTH_LOGIN_SESSION_SERVICE_PROVIDE)
    private readonly authLoginSessionServiceProvider: AuthLoginSessionServiceInterface,
  ) {}

  @Get('/login-session')
  @ApiOkResponse({ type: AuthLoginSessionResponseDto })
  @ApiBody({ type: AuthLoginSessionParamsDto })
  async loginSession(
    @Body() params: AuthLoginSessionControllerParams,
  ): Promise<AuthLoginSessionControllerResponse> {
    this.logProvider.info('AuthController');
    return this.authLoginSessionServiceProvider.execute(params);
  }
}
