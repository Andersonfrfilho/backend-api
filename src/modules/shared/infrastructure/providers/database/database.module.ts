import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderDatabaseImplementationsModule } from './implementations/database.implementation.module';

@Module({
  imports: [SharedInfrastructureProviderDatabaseImplementationsModule],
  exports: [SharedInfrastructureProviderDatabaseImplementationsModule],
})
export class SharedInfrastructureProviderDatabaseModule {}
