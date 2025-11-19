import { DataSource } from 'typeorm';

import { getDatabaseConfig } from '@config/database-config';

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

  // Entities - onde TypeORM encontra as entidades
  entities: [
    'src/**/*.entity.ts', // Para desenvolvimento
    'dist/**/*.entity.js', // Para produção
  ],

  // Migrations
  migrations: [
    'src/modules/shared/infrastructure/providers/database/implementations/postgres/migrations/*.ts',
  ],
});

export default PostgresDataSource;
