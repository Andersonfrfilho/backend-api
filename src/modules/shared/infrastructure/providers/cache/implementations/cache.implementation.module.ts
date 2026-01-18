import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderCacheImplementationRedisModule } from './redis/redis.module';

@Module({
  imports: [SharedInfrastructureProviderCacheImplementationRedisModule],
  exports: [SharedInfrastructureProviderCacheImplementationRedisModule],
})
export class SharedInfrastructureProviderCacheImplementationModule {}
