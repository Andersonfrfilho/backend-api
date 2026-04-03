import { LOGGER_PROVIDER, type LoggerProviderInterface } from '@adatechnology/logger';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import type { HttpProviderInterface } from '@adatechnology/http-client';

import { HTTP_POKEMON } from './pokemon.token';

@Controller('pokemon')
export class PokemonController {
  constructor(
    @Inject(HTTP_POKEMON)
    private readonly http: HttpProviderInterface,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerProviderInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar Pokémons', description: 'Retorna lista paginada de Pokémons via PokeAPI.' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiOkResponse({ description: 'Lista de Pokémons.' })
  async list(@Query('limit') limit = '20', @Query('offset') offset = '0') {
    const logContext = { className: PokemonController.name, methodName: this.list.name };
    const url = `/pokemon?limit=${limit}&offset=${offset}`;

    this.logger.info({ message: 'List pokemon start', context: PokemonController.name, meta: { url, logContext } });

    const res = await this.http.get({
      url,
      config: {
        cache: true,
        cacheTtl: 60_000,
        logContext,
      },
    });

    this.logger.info({ message: 'List pokemon end', context: PokemonController.name, meta: { status: res.status, logContext } });

    return res.data;
  }

  @Get(':idOrName')
  @ApiOperation({ summary: 'Buscar Pokémon por ID ou nome', description: 'Retorna dados completos de um Pokémon.' })
  @ApiParam({ name: 'idOrName', example: 'pikachu' })
  @ApiOkResponse({ description: 'Dados do Pokémon.' })
  async getOne(@Param('idOrName') idOrName: string) {
    const logContext = { className: PokemonController.name, methodName: this.getOne.name };
    const url = `/pokemon/${idOrName}`;

    this.logger.info({ message: 'Get pokemon start', context: PokemonController.name, meta: { idOrName, logContext } });

    const res = await this.http.get({
      url,
      config: {
        cache: true,
        cacheTtl: 300_000,
        logContext,
      },
    });

    this.logger.info({ message: 'Get pokemon end', context: PokemonController.name, meta: { status: res.status, logContext } });

    return res.data;
  }

  @Get(':idOrName/abilities')
  @ApiOperation({ summary: 'Listar habilidades do Pokémon', description: 'Retorna as abilities de um Pokémon.' })
  @ApiParam({ name: 'idOrName', example: 'bulbasaur' })
  @ApiOkResponse({ description: 'Habilidades do Pokémon.' })
  async getAbilities(@Param('idOrName') idOrName: string) {
    const logContext = { className: PokemonController.name, methodName: this.getAbilities.name };

    this.logger.info({ message: 'Get abilities start', context: PokemonController.name, meta: { idOrName, logContext } });

    const res = await this.http.get({
      url: `/pokemon/${idOrName}`,
      config: { cache: true, cacheTtl: 300_000, logContext },
    });

    const abilities = (res.data?.abilities ?? []).map((a: any) => ({
      name: a.ability?.name,
      isHidden: a.is_hidden,
      slot: a.slot,
    }));

    this.logger.info({ message: 'Get abilities end', context: PokemonController.name, meta: { count: abilities.length, logContext } });

    return { pokemon: idOrName, abilities };
  }

  @Get(':idOrName/species')
  @ApiOperation({ summary: 'Dados de espécie do Pokémon', description: 'Retorna informações da espécie via PokeAPI.' })
  @ApiParam({ name: 'idOrName', example: 'ditto' })
  @ApiOkResponse({ description: 'Dados da espécie.' })
  async getSpecies(@Param('idOrName') idOrName: string) {
    const logContext = { className: PokemonController.name, methodName: this.getSpecies.name };

    this.logger.info({ message: 'Get species start', context: PokemonController.name, meta: { idOrName, logContext } });

    const res = await this.http.get({
      url: `/pokemon-species/${idOrName}`,
      config: { cache: true, cacheTtl: 300_000, logContext },
    });

    this.logger.info({ message: 'Get species end', context: PokemonController.name, meta: { status: res.status, logContext } });

    return res.data;
  }

  @Get(':idOrName/cache-demo')
  @ApiOperation({
    summary: 'Demo de cache',
    description: 'Faz duas chamadas idênticas para o mesmo Pokémon e mostra se a segunda veio do cache.',
  })
  @ApiParam({ name: 'idOrName', example: 'charmander' })
  async cacheDemo(@Param('idOrName') idOrName: string) {
    const logContext = { className: PokemonController.name, methodName: this.cacheDemo.name };
    const url = `/pokemon/${idOrName}`;

    this.logger.info({ message: 'Cache demo start', context: PokemonController.name, meta: { idOrName, logContext } });

    const t1 = Date.now();
    const first = await this.http.get({ url, config: { cache: true, cacheTtl: 60_000, logContext } });
    const d1 = Date.now() - t1;

    const t2 = Date.now();
    const second = await this.http.get({ url, config: { cache: true, cacheTtl: 60_000, logContext } });
    const d2 = Date.now() - t2;

    this.logger.info({
      message: 'Cache demo end',
      context: PokemonController.name,
      meta: { firstMs: d1, secondMs: d2, cacheHit: d2 < d1, logContext },
    });

    return {
      pokemon: idOrName,
      firstCall: { status: first.status, durationMs: d1 },
      secondCall: { status: second.status, durationMs: d2 },
      cacheHit: d2 < d1,
    };
  }
}
