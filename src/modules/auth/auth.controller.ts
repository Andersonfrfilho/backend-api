import { Body, Controller, Inject, Injectable, Post, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { AuthLoginSessionServiceInterface } from '@modules/auth/domain/auth.login-session.interface';
import {
  AuthBadRequestErrorValidationRequestDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
  AuthLoginSessionServiceInternalServerErrorDto,
} from '@modules/auth/domain/exceptions';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';

import {
  AuthLoginSessionRequestDto as AuthLoginSessionRequestParamsDto,
  AuthLoginSessionResponseDto as AuthLoginSessionResponseController,
} from './shared/dtos';

@Injectable()
@Controller('/auth')
export class AuthController {
  constructor(
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
  @ApiOkResponse({ type: AuthLoginSessionRequestParamsDto })
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
    @Body() params: AuthLoginSessionRequestParamsDto,
  ): Promise<AuthLoginSessionResponseController> {
    return this.authLoginSessionServiceProvider.execute(params);
  }
}
