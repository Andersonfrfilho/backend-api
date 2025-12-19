import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderDatabaseImplementationsMongoModule } from './mongo/mongo.module';
import { SharedInfrastructureProviderDatabaseImplementationsPostgresModule } from './postgres/postgres.module';

@Module({
  imports: [
    SharedInfrastructureProviderDatabaseImplementationsPostgresModule,
    SharedInfrastructureProviderDatabaseImplementationsMongoModule,
  ],
  exports: [
    SharedInfrastructureProviderDatabaseImplementationsPostgresModule,
    SharedInfrastructureProviderDatabaseImplementationsMongoModule,
  ],
})
export class SharedInfrastructureProviderDatabaseImplementationsModule {}
