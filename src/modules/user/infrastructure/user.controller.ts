import type { CacheProviderInterface } from '@adatechnology/cache';
import { CACHE_PROVIDER } from '@adatechnology/cache';
import { LOGGER_PROVIDER, type LoggerProviderInterface } from '@adatechnology/logger';
import { Body, Controller, Get, Inject, Injectable, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import type { UserServiceInterface } from '@modules/user/application/interfaces/create-user.interface';
import { USER_SERVICE_PROVIDE } from '@modules/user/infrastructure/user.token';
import { CreateUserRequestDto } from '@modules/user/shared/dtos/create-user-request.dto';
import { CreateUserResponseDto } from '@modules/user/shared/dtos/create-user-response.dto';

@Injectable()
@Controller('/user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE_PROVIDE)
    private readonly userService: UserServiceInterface,
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerProviderInterface,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar um usuário',
    description: `
      Esta rota realiza a criação de um novo usuário.
    `,
  })
  @ApiOkResponse({
    description: 'Usuário criado com sucesso.',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() params: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const logContext = { className: UserController.name, methodName: this.create.name };

    const user = await this.userService.createUser(params);

    try {
      await this.cacheProvider.del('users:list');
      this.logger.info({ message: 'Cache invalidated: users:list', context: UserController.name, meta: { logContext } });
    } catch (error) {
      this.logger.error({ message: 'Failed to invalidate cache', context: UserController.name, meta: { error: error.message, logContext } });
    }

    return user;
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: `
      Esta rota retorna uma lista de todos os usuários com cache.
    `,
  })
  @ApiOkResponse({
    description: 'Lista de usuários retornada com sucesso.',
  })
  @ApiInternalServerErrorResponse()
  async findAll() {
    const logContext = { className: UserController.name, methodName: this.findAll.name };
    const cacheKey = 'users:list';

    try {
      const encrypted = await this.cacheProvider.get<string>(cacheKey);
      if (encrypted) {
        const decoded = JSON.parse(Buffer.from(encrypted as any, 'base64').toString('utf8'));
        this.logger.info({ message: 'Users loaded from cache', context: UserController.name, meta: { logContext } });
        return {
          data: decoded,
          source: 'cache',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      this.logger.error({ message: 'Cache read error', context: UserController.name, meta: { error: error.message, logContext } });
    }

    this.logger.info({ message: 'Loading users from database', context: UserController.name, meta: { logContext } });

    const users = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];

    try {
      const encoded = Buffer.from(JSON.stringify(users)).toString('base64');
      await this.cacheProvider.set(cacheKey, encoded, 300);
      this.logger.info({ message: 'Users cached for 5 minutes', context: UserController.name, meta: { logContext } });
    } catch (error) {
      this.logger.error({ message: 'Cache write error', context: UserController.name, meta: { error: error.message, logContext } });
    }

    return {
      data: users,
      source: 'database',
      timestamp: new Date().toISOString(),
    };
  }
}
