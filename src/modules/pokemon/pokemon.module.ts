import { HttpModule } from '@adatechnology/http-client';
import { LoggerModule } from '@adatechnology/logger';
import { Module } from '@nestjs/common';

import { HTTP_POKEMON } from './pokemon.token';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [
    LoggerModule.forRoot(),
    HttpModule.forRoot(
      { baseURL: 'https://pokeapi.co/api/v2', timeout: 10_000 },
      {
        provide: HTTP_POKEMON,
        logging: {
          enabled: true,
          environments: ['development', 'test', 'production'],
          types: ['request', 'response', 'error'],
          includeHeaders: false,
          includeBody: false,
          context: 'PokemonHttpClient',
        },
      },
    ),
  ],
  controllers: [PokemonController],
})
export class PokemonModule {}
