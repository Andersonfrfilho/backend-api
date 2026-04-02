import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderDatabaseModule } from './database/database.module';
import { SharedInfrastructureProviderQueueModule } from './queue/queue.module';

@Module({
  imports: [SharedInfrastructureProviderDatabaseModule, SharedInfrastructureProviderQueueModule],
  exports: [SharedInfrastructureProviderDatabaseModule, SharedInfrastructureProviderQueueModule],
})
export class SharedInfrastructureProviderModule {}
