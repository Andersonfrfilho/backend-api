import type { CacheProviderInterface } from '@adatechnology/cache';
import { CACHE_PROVIDER } from '@adatechnology/cache';
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
    const user = await this.userService.createUser(params);

    // 🔥 INVALIDAR CACHE - Quando criar usuário, limpar cache da lista
    try {
      await this.cacheProvider.del('users:list');
      console.log('✅ Cache invalidated: users:list');
    } catch (error) {
      console.error('❌ Failed to invalidate cache:', error);
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
    const cacheKey = 'users:list';

    try {
      // 🔥 TENTAR BUSCAR DO CACHE PRIMEIRO (stored as base64-encoded JSON)
      const encrypted = await this.cacheProvider.get<string>(cacheKey);
      if (encrypted) {
        const decoded = JSON.parse(Buffer.from(encrypted as any, 'base64').toString('utf8'));
        console.log('✅ Users loaded from cache');
        return {
          data: decoded,
          source: 'cache',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('❌ Cache read error:', error);
    }

    // 🔥 BUSCAR DO BANCO SE NÃO ESTIVER NO CACHE
    console.log('📊 Loading users from database');
    // Note: Aqui você precisaria implementar um método no service/repository
    // Por enquanto, simulamos dados para demonstração
    const users = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];

    // 🔥 SALVAR NO CACHE PARA PRÓXIMAS REQUISIÇÕES
    try {
      const encoded = Buffer.from(JSON.stringify(users)).toString('base64');
      await this.cacheProvider.set(cacheKey, encoded, 300); // 5 minutos
      console.log('✅ Users cached for 5 minutes');
    } catch (error) {
      console.error('❌ Cache write error:', error);
    }

    return {
      data: users,
      source: 'database',
      timestamp: new Date().toISOString(),
    };
  }
}
