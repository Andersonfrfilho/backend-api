import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config/config.module';

import PostgresDataSource from './postgres.database-connection';
import { databaseProviders } from './postgres.provider';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        if (!PostgresDataSource.isInitialized) {
          await PostgresDataSource.initialize();
        }
        return PostgresDataSource.options;
      },
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders, TypeOrmModule],
})
export class SharedInfrastructureProviderDatabaseImplementationsPostgresModule {}
