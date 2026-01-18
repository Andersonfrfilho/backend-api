import { Module, OnModuleDestroy } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config/config.module';

import { CONNECTIONS_NAMES } from '../../database.constant';
import { DATABASE_MONGO_SOURCE } from '../../database.token';

import { MongoDataSource } from './mongo.database-conection';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      name: CONNECTIONS_NAMES.MONGO,
      imports: [ConfigModule],
      useFactory: async () => {
        const isE2E = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

        // Use MONGO_URI_TEST_E2E for E2E tests if available
        if (isE2E && process.env.MONGO_URI_TEST_E2E) {
          console.log('🔌 Using MONGO_URI_TEST_E2E for MongoDB E2E connection');
          return {
            type: 'mongodb',
            url: process.env.MONGO_URI_TEST_E2E,
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: false,
          } as any;
        }

        // Use MONGO_URI if available (recommended approach)
        if (process.env.MONGO_URI) {
          console.log('🔌 Using MONGO_URI for MongoDB connection');
          return {
            type: 'mongodb',
            url: process.env.MONGO_URI,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
            dropSchema: false,
          } as any;
        }

        // Fallback to individual config values - only if MONGO_URI is not available
        console.log('🔌 Using individual MongoDB config values');
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
export class SharedInfrastructureProviderDatabaseImplementationsMongoModule
  implements OnModuleDestroy
{
  async onModuleDestroy() {
    try {
      if (MongoDataSource.isInitialized) {
        await MongoDataSource.destroy();
      }
    } catch (error) {
      // Ignore errors during module destruction
      console.warn('⚠️  Error destroying MongoDataSource:', (error as Error).message);
    }
  }
}
