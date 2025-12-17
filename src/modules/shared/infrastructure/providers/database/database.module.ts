import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderDatabaseImplementationsPostgresModule } from './implementations/postgres/postgres.module';

@Module({
  imports: [SharedInfrastructureProviderDatabaseImplementationsPostgresModule],
  exports: [SharedInfrastructureProviderDatabaseImplementationsPostgresModule],
})
export class SharedInfrastructureProviderDatabaseModule {}
