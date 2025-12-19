import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config/config.module';

import { DATABASE_MONGO_SOURCE } from '../../database.token';

import { MongoDataSource } from './mongo.database-conection';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        if (!MongoDataSource.isInitialized) {
          await MongoDataSource.initialize();
        }
        return MongoDataSource.options;
      },
    }),
  ],
  providers: [
    {
      provide: DATABASE_MONGO_SOURCE,
      useFactory: async () => {
        return MongoDataSource.initialize();
      },
    },
  ],
  exports: [TypeOrmModule],
})
export class SharedInfrastructureProviderDatabaseImplementationsMongoModule {}
