import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderCacheModule } from './cache/cache.module';
import { SharedInfrastructureProviderDatabaseModule } from './database/database.module';
import { SharedInfrastructureProviderLogModule } from './log/log.module';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureProviderDatabaseModule,
    SharedInfrastructureProviderCacheModule,
  ],
  exports: [
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureProviderDatabaseModule,
    SharedInfrastructureProviderCacheModule,
  ],
})
export class SharedInfrastructureProviderModule {}
