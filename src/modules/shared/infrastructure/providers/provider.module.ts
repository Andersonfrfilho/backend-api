import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderDatabaseModule } from './database/database.module';
import { SharedInfrastructureProviderLogModule } from './log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule, SharedInfrastructureProviderDatabaseModule],
  exports: [SharedInfrastructureProviderLogModule, SharedInfrastructureProviderDatabaseModule],
})
export class SharedInfrastructureProviderModule {}
