import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigModule } from '@app/config/config.module';

import { CACHE_REDIS_CONNECTION, CACHE_REDIS_PROVIDER } from '../../cache.token';

import { createRedisConnection } from './redis.connection';
import { CacheRedisProvider } from './redis.provider';

@Module({
  imports: [ConfigModule], // Importa para acessar env vars
  providers: [
    {
      provide: CACHE_REDIS_CONNECTION, // Token para injeção
      useFactory: createRedisConnection,
      inject: [ConfigService],
    },
    {
      provide: CACHE_REDIS_PROVIDER,
      useClass: CacheRedisProvider,
    },
  ],
  exports: [CACHE_REDIS_CONNECTION, CACHE_REDIS_PROVIDER],
})
export class SharedInfrastructureProviderCacheImplementationRedisModule {}
