import { DataSource } from 'typeorm';

import { getDatabaseConfig } from '@app/config/database-config';

import { DATABASE_TYPES, MONGO_AUTH_DATABASE_NAME } from '../constant';

const config = getDatabaseConfig();

export const MongoDataSource = new DataSource({
  type: DATABASE_TYPES.MONGO,
  host: config.mongo.host,
  port: config.mongo.port,
  username: config.mongo.username,
  password: config.mongo.password,
  database: config.mongo.database,
  logging: config.mongo.logging,
  synchronize: config.mongo.synchronize,
  entities: [],
  authSource: MONGO_AUTH_DATABASE_NAME.ADMIN, // MongoDB authentication database
});
