import { DataSource } from 'typeorm';

import { getDatabaseConfig } from '@config/database-config';

import { PATH_ENTITIES_PATTERN, PATH_MIGRATIONS_PATTERN } from './postgres.constant';

const config = getDatabaseConfig();

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: config.logging,
  synchronize: config.synchronize,

  entities: PATH_ENTITIES_PATTERN,
  migrations: PATH_MIGRATIONS_PATTERN,
});

export default PostgresDataSource;
