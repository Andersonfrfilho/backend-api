import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config/config.module';

import { CONNECTIONS_NAMES } from '../../database.constant';
import { DATABASE_POSTGRES_SOURCE } from '../../database.token';

import PostgresDataSource from './postgres.database-connection';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: CONNECTIONS_NAMES.POSTGRES,
      imports: [ConfigModule],
      useFactory: async () => {
        if (!PostgresDataSource.isInitialized) {
          await PostgresDataSource.initialize();
        }
        return PostgresDataSource.options;
      },
    }),
  ],
  providers: [
    {
      provide: DATABASE_POSTGRES_SOURCE,
      useFactory: async () => {
        return PostgresDataSource.initialize();
      },
    },
  ],
  exports: [DATABASE_POSTGRES_SOURCE, TypeOrmModule],
})
export class SharedInfrastructureProviderDatabaseImplementationsPostgresModule {}
