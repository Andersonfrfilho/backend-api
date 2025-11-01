import {
  Body,
  Controller,
  Inject,
  Injectable,
  Post,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AuthLoginSessionControllerParams,
  AuthLoginSessionControllerResponse,
} from '@modules/auth/auth.interface';
import {
  AuthLoginSessionResponseDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
} from '@modules/auth/services/login-session/auth.login-session.dto';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/services/login-session/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/services/login-session/auth.login-session.interface';
import type { LogProviderInterface } from '@modules/shared/infrastructure/providers/log/log.interface';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.interface';

import {
  AuthBadRequestErrorValidationRequestDto,
  AuthLoginSessionServiceInternalServerErrorDto,
} from './auth.dtos';

@Injectable()
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Inject(AUTH_LOGIN_SESSION_SERVICE_PROVIDE)
    private readonly authLoginSessionServiceProvider: AuthLoginSessionServiceInterface,
  ) {}

  @Post('/login-session')
  @Version('1')
  @ApiOperation({
    summary: 'Cria uma nova sessão de login',
    description: `
      Esta rota realiza a autenticação do usuário e retorna os tokens de acesso e atualização.
    `,
  })
  @ApiOkResponse({ type: AuthLoginSessionResponseDto })
  @ApiNotFoundResponse({
    type: AuthLoginSessionServiceErrorNotFoundDto,
  })
  @ApiUnauthorizedResponse({
    type: AuthLoginSessionServiceErrorInvalidCredentialsDto,
  })
  @ApiBadRequestResponse({
    type: AuthBadRequestErrorValidationRequestDto,
  })
  @ApiInternalServerErrorResponse({
    type: AuthLoginSessionServiceInternalServerErrorDto,
  })
  @ApiBearerAuth()
  async loginSession(
    @Body() params: AuthLoginSessionControllerParams,
  ): Promise<AuthLoginSessionControllerResponse> {
    this.logProvider.info('AuthController');
    return this.authLoginSessionServiceProvider.execute(params);
  }
}
