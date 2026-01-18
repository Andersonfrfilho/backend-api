import { DataSource } from 'typeorm';

import { getDatabaseConfig } from '@app/config/database-config';
import { Notification } from '@app/modules/shared/domain/entities/notification.entity';

import { DATABASE_TYPES, MONGO_AUTH_DATABASE_NAME } from '../constant';

const config = getDatabaseConfig();

export const MongoDataSource = new DataSource({
  type: DATABASE_TYPES.MONGO,
  ...(process.env.MONGO_URI
    ? { url: process.env.MONGO_URI }
    : {
        host: config.mongo.host,
        port: config.mongo.port,
        username: config.mongo.username,
        password: config.mongo.password,
        database: config.mongo.database,
        authSource: MONGO_AUTH_DATABASE_NAME.ADMIN,
      }),
  logging: config.mongo.logging,
  synchronize: config.mongo.synchronize,
  entities: [Notification],
});
