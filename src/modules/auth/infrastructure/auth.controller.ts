import { Body, Controller, Inject, Injectable, Post, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AuthBadRequestErrorValidationRequestDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
  AuthLoginSessionServiceInternalServerErrorDto,
} from '@modules/auth/domain/auth.exceptions';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/domain/auth.login-session.interface';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.token';

import {
  AuthLoginSessionRequestDto as AuthLoginSessionRequestParamsDto,
  AuthLoginSessionResponseDto as AuthLoginSessionResponseController,
} from '@modules/auth/shared/dtos';

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
      
      **Proteção contra força bruta:** Máximo 5 tentativas a cada 15 minutos por IP.
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
  @ApiTooManyRequestsResponse({
    description: 'Muitas tentativas de login. Bloqueado por 15 minutos.',
    schema: {
      example: {
        statusCode: 429,
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      },
    },
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
