import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions.js';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const DATABASE_TYPES = {
  POSTGRES: 'postgres' as PostgresConnectionOptions['type'],
  MONGO: 'mongodb' as MongoConnectionOptions['type'],
};

export const MONGO_AUTH_DATABASE_NAME = {
  ADMIN: 'admin',
};
