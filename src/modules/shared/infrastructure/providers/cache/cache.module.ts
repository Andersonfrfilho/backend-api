import { Module } from '@nestjs/common';

import { CacheProvider } from './cache.provider';
import { CACHE_PROVIDER } from './cache.token';
import { SharedInfrastructureProviderCacheImplementationModule } from './implementations/cache.implementation.module';

@Module({
  imports: [SharedInfrastructureProviderCacheImplementationModule],
  providers: [
    {
      provide: CACHE_PROVIDER,
      useClass: CacheProvider,
    },
  ],
  exports: [CACHE_PROVIDER],
})
export class SharedInfrastructureProviderCacheModule {}
