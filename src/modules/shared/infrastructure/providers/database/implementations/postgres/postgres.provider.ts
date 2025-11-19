import { DataSource } from 'typeorm';

import { ENVIRONMENT_SERVICE_PROVIDER } from '@app/config/config.token';
import { EnvironmentProviderInterface } from '@config/domain/interfaces/environment.interface';

import { DATABASE_CONNECTION_TYPES } from '../../database.constant';
import { DATABASE_POSTGRES_SOURCE } from '../../database.token';

import { PATH_ENTITIES_PATTERN } from './postgres.constant';

export const databaseProviders = [
  {
    provide: DATABASE_POSTGRES_SOURCE,
    useFactory: async (environmentProvider: EnvironmentProviderInterface) => {
      const dataSource = new DataSource({
        type: DATABASE_CONNECTION_TYPES.POSTGRES as 'postgres',
        host: environmentProvider.databasePostgresHost || 'localhost',
        port: environmentProvider.databasePostgresPort || 5432,
        username: environmentProvider.databasePostgresUser || 'root',
        password: environmentProvider.databasePostgresPassword || 'root',
        database: environmentProvider.databasePostgresName || 'test',
        entities: PATH_ENTITIES_PATTERN,
        synchronize: environmentProvider.databasePostgresSynchronize || false,
      });

      return dataSource.initialize();
    },
    inject: [
      {
        token: ENVIRONMENT_SERVICE_PROVIDER,
        optional: false,
      },
    ],
  },
];
