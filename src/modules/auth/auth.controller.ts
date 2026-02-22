import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
  Version,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

import { HTTP_STATUS } from '@config/constants';
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

import { MockApiClientService } from './application/mock-api-client.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_LOGIN_SESSION_SERVICE_PROVIDE)
    private readonly authLoginSessionServiceProvider: AuthLoginSessionServiceInterface,
    private readonly mockApiClient: MockApiClientService,
  ) {}

  /**
   * Primary login route (versioned)
   * Delegates to the application's login-session service which is implemented using Keycloak provider
   */
  @Post('/login-session')
  @Version('1')
  @ApiOperation({
    summary: 'Cria uma nova sessão de login',
    description: `Esta rota realiza a autenticação do usuário e retorna os tokens de acesso e atualização.`,
  })
  @ApiOkResponse({ type: AuthLoginSessionResponseController })
  @ApiNotFoundResponse({ type: AuthLoginSessionServiceErrorNotFoundDto })
  @ApiUnauthorizedResponse({ type: AuthLoginSessionServiceErrorInvalidCredentialsDto })
  @ApiBadRequestResponse({ type: AuthBadRequestErrorValidationRequestDto })
  @ApiTooManyRequestsResponse({
    description: 'Muitas tentativas de login. Bloqueado por 15 minutos.',
  })
  @ApiInternalServerErrorResponse({ type: AuthLoginSessionServiceInternalServerErrorDto })
  @ApiBearerAuth()
  async loginSession(
    @Body() params: AuthLoginSessionRequestParamsDto,
  ): Promise<AuthLoginSessionResponseController> {
    return this.authLoginSessionServiceProvider.execute(params);
  }

  // --- Mock API endpoints (kept for testing external calls using authenticated provider)
  @Get('mock/posts')
  @Version('1')
  @ApiOperation({ summary: 'Get posts from mock API with auth' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Posts retrieved' })
  async getPosts() {
    return this.mockApiClient.getPosts();
  }

  @Get('mock/posts/:id')
  @Version('1')
  @ApiOperation({ summary: 'Get a specific post from mock API with auth' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Post retrieved' })
  async getPost(@Param('id') id: number) {
    return this.mockApiClient.getPost(id);
  }

  @Post('mock/posts')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a post in mock API with auth' })
  @ApiResponse({ status: HTTP_STATUS.CREATED, description: 'Post created' })
  async createPost(@Body() data: { title: string; body: string; userId: number }) {
    return this.mockApiClient.createPost(data);
  }
}
