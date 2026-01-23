import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderCacheModule } from './cache/cache.module';
import { SharedInfrastructureProviderDatabaseModule } from './database/database.module';
import { SharedInfrastructureProviderLogModule } from './log/log.module';
import { SharedInfrastructureProviderQueueModule } from './queue/queue.module';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureProviderDatabaseModule,
    SharedInfrastructureProviderCacheModule,
    SharedInfrastructureProviderQueueModule,
  ],
  exports: [
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureProviderDatabaseModule,
    SharedInfrastructureProviderCacheModule,
    SharedInfrastructureProviderQueueModule,
  ],
})
export class SharedInfrastructureProviderModule {}
