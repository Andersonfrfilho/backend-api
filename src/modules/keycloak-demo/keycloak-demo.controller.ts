import { getContext, LOGGER_PROVIDER, type LoggerProviderInterface, runWithContext } from '@adatechnology/logger';
import { Roles, RolesGuard } from '@adatechnology/auth-keycloak';
import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { KeycloakDemoService } from './keycloak-demo.service';

@Controller('keycloak')
export class KeycloakDemoController {
  constructor(
    private readonly keycloakService: KeycloakDemoService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerProviderInterface,
  ) {}

  /** Envolve fn com logContext no AsyncLocalStorage para rastreamento nas libs */
  private withCtx<T>(logContext: object, fn: () => Promise<T>): Promise<T> {
    return runWithContext({ ...(getContext() ?? {}), logContext }, fn);
  }

  @Get('token')
  @ApiOperation({
    summary: 'Obter token via client_credentials',
    description: 'Retorna um access_token usando as credenciais configuradas no servidor.',
  })
  @ApiOkResponse({ description: 'Access token retornado com sucesso.' })
  async getToken() {
    const logContext = { className: KeycloakDemoController.name, methodName: this.getToken.name };

    this.logger.info({ message: 'Get token start', context: KeycloakDemoController.name, meta: { logContext } });

    const token = await this.withCtx(logContext, () => this.keycloakService.getAccessToken());

    this.logger.info({ message: 'Get token end', context: KeycloakDemoController.name, meta: { logContext } });

    return { access_token: token };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login com usuário e senha (password grant)',
    description: 'Retorna o token completo (access_token, refresh_token, etc.) usando credenciais de usuário.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'secret' },
      },
    },
  })
  @ApiOkResponse({ description: 'Token Keycloak completo.' })
  @ApiBadRequestResponse({ description: 'username e password são obrigatórios.' })
  async login(@Body() body: { username: string; password: string }) {
    const logContext = { className: KeycloakDemoController.name, methodName: this.login.name };
    const { username, password } = body ?? {};

    if (!username || !password) {
      return { error: 'username e password são obrigatórios' };
    }

    this.logger.info({ message: 'Login start', context: KeycloakDemoController.name, meta: { username, logContext } });

    const tokenResponse = await this.withCtx(logContext, () =>
      this.keycloakService.loginWithCredentials(username, password),
    );

    this.logger.info({ message: 'Login end', context: KeycloakDemoController.name, meta: { username, logContext } });

    return tokenResponse;
  }

  @Get('userinfo')
  @ApiOperation({
    summary: 'Obter informações do usuário',
    description: 'Retorna as claims do token via endpoint userinfo do Keycloak.',
  })
  @ApiQuery({ name: 'token', required: true, description: 'Access token JWT', example: 'eyJhbG...' })
  @ApiOkResponse({ description: 'Claims do usuário.' })
  async getUserInfo(@Query('token') token: string) {
    const logContext = { className: KeycloakDemoController.name, methodName: this.getUserInfo.name };

    if (!token) {
      return { error: 'query param token é obrigatório' };
    }

    this.logger.info({ message: 'Get userinfo start', context: KeycloakDemoController.name, meta: { logContext } });

    const info = await this.withCtx(logContext, () => this.keycloakService.getUserInfo(token));

    this.logger.info({ message: 'Get userinfo end', context: KeycloakDemoController.name, meta: { logContext } });

    return info;
  }

  @Get('validate')
  @ApiOperation({
    summary: 'Validar token',
    description: 'Verifica se um access token ainda é válido.',
  })
  @ApiQuery({ name: 'token', required: true, description: 'Access token JWT', example: 'eyJhbG...' })
  @ApiOkResponse({ description: 'Resultado da validação.' })
  async validateToken(@Query('token') token: string) {
    const logContext = { className: KeycloakDemoController.name, methodName: this.validateToken.name };

    if (!token) {
      return { error: 'query param token é obrigatório' };
    }

    this.logger.info({ message: 'Validate token start', context: KeycloakDemoController.name, meta: { logContext } });

    const valid = await this.withCtx(logContext, () => this.keycloakService.validateToken(token));

    this.logger.info({ message: 'Validate token end', context: KeycloakDemoController.name, meta: { valid, logContext } });

    return { valid };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar token via refresh_token',
    description: 'Usa o refresh_token para obter um novo access_token.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refresh_token'],
      properties: {
        refresh_token: { type: 'string', example: 'eyJhbG...' },
      },
    },
  })
  @ApiOkResponse({ description: 'Novo token Keycloak.' })
  async refreshToken(@Body() body: { refresh_token: string }) {
    const logContext = { className: KeycloakDemoController.name, methodName: this.refreshToken.name };

    if (!body?.refresh_token) {
      return { error: 'refresh_token é obrigatório no body' };
    }

    this.logger.info({ message: 'Refresh token start', context: KeycloakDemoController.name, meta: { logContext } });

    const tokenResponse = await this.withCtx(logContext, () =>
      this.keycloakService.refreshToken(body.refresh_token),
    );

    this.logger.info({ message: 'Refresh token end', context: KeycloakDemoController.name, meta: { logContext } });

    return tokenResponse;
  }

  @Get('clear-cache')
  @ApiOperation({
    summary: 'Limpar cache do token interno',
    description: 'Força a busca de um novo token na próxima chamada a /keycloak/token.',
  })
  @ApiOkResponse({ description: 'Cache limpo.' })
  async clearCache() {
    const logContext = { className: KeycloakDemoController.name, methodName: this.clearCache.name };

    this.logger.info({ message: 'Clear token cache', context: KeycloakDemoController.name, meta: { logContext } });

    await this.keycloakService.clearTokenCache();

    return { cleared: true };
  }

  // ── Rotas protegidas por role ─────────────────────────────────────────────

  @Get('secure/public')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Rota pública (nenhuma role exigida)', description: 'Qualquer token válido acessa.' })
  @ApiBearerAuth()
  securePublic() {
    return { message: 'Acesso público OK' };
  }

  @Get('secure/admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Rota protegida – role admin', description: 'Só usuários com role admin acessam.' })
  @ApiBearerAuth()
  secureAdmin() {
    return { message: 'Acesso admin OK' };
  }

  @Get('secure/whoami')
  @ApiOperation({ summary: 'Verifica presença do token', description: 'Retorna se o token foi enviado.' })
  @ApiParam({ name: 'token', required: false })
  whoami(@Query('token') token?: string) {
    return { tokenProvided: !!token };
  }
}
