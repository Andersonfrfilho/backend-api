import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config/config.module';
import { databaseProviders } from '@modules/shared/infrastructure/providers/database/implementations/postgres/postgres.provider';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class SharedInfrastructureProviderDatabaseImplementationsPostgresModule {}
