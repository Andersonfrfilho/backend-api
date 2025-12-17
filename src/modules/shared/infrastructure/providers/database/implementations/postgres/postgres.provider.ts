import { DATABASE_POSTGRES_SOURCE } from '@modules/shared/infrastructure/providers/database/database.token';

import PostgresDataSource from './postgres.database-connection';

export const databaseProviders = [
  {
    provide: DATABASE_POSTGRES_SOURCE,
    useFactory: async () => {
      return PostgresDataSource.initialize();
    },
  },
];
