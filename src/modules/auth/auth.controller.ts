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

import { AuthLoginSessionControllerRequestDto } from '@modules/auth/application/dtos/LoginSessionRequest.dto';
import { AuthLoginSessionControllerResponseDto } from '@modules/auth/application/dtos/LoginSessionResponse.dto';
import type {
  AuthLoginSessionControllerInterface,
  AuthLoginSessionServiceInterface,
} from '@modules/auth/auth.interface';
import {
  AuthBadRequestErrorValidationRequestDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
  AuthLoginSessionServiceInternalServerErrorDto,
} from '@modules/auth/domain/exceptions';

import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from './infrastructure/auth.provider';

@Injectable()
@Controller('/auth')
export class AuthController implements AuthLoginSessionControllerInterface {
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
  @ApiOkResponse({ type: AuthLoginSessionControllerResponseDto })
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
    @Body() params: AuthLoginSessionControllerRequestDto,
  ): Promise<AuthLoginSessionControllerResponseDto> {
    return this.authLoginSessionServiceProvider.execute(params);
  }
}
