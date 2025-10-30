import {
  Body,
  Controller,
  Inject,
  Injectable,
  Post,
  Version,
} from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import type {
  AuthLoginSessionControllerParams,
  AuthLoginSessionControllerResponse,
} from '@modules/auth/auth.interface';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/services/login-session/auth.login-session.interface';
import type { AuthLoginSessionServiceInterface } from '@modules/auth/services/login-session/auth.login-session.interface';
import {
  AuthLoginSessionParamsDto,
  AuthLoginSessionResponseDto,
  AuthLoginSessionServiceErrorInvalidCredentialsDto,
  AuthLoginSessionServiceErrorNotFoundDto,
  ERRORS_AUTH_LOGIN_SESSION,
} from '@modules/auth/services/login-session/auth.login-session.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginSessionServiceInternalServerErrorDto } from '@app/common/dtos/error/errors.dto';

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
  @ApiBearerAuth()
  @ApiNotFoundResponse({
    type: AuthLoginSessionServiceErrorNotFoundDto,
    examples: {
      missingField: {
        summary: 'User not found error',
        value: ERRORS_AUTH_LOGIN_SESSION.MISSING_CREDENTIALS,
      },
      notFound: {
        summary: 'Any way',
        value: {
          statusCode: 404,
          message: 'User not found',
          code: 404,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    type: AuthLoginSessionServiceErrorInvalidCredentialsDto,
  })
  @ApiInternalServerErrorResponse({
    type: AuthLoginSessionServiceInternalServerErrorDto,
  })
  @ApiBody({ type: AuthLoginSessionParamsDto })
  async loginSession(
    @Body() params: AuthLoginSessionControllerParams,
  ): Promise<AuthLoginSessionControllerResponse> {
    this.logProvider.info('AuthController');
    return this.authLoginSessionServiceProvider.execute(params);
  }
}
