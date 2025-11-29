import { DataSource } from 'typeorm';

import { Phone } from '@app/modules/shared/domain/entities/phone.entity';
import { Type } from '@app/modules/shared/domain/entities/type.entity';
import { User } from '@app/modules/shared/domain/entities/user.entity';
import { UserType } from '@app/modules/shared/domain/entities/userTypes.entity';
import { getDatabaseConfig } from '@config/database-config';

import { PATH_MIGRATIONS_PATTERN } from './postgres.constant';

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

  entities: [User, Type, Phone, UserType],
  migrations: PATH_MIGRATIONS_PATTERN,
});

export default PostgresDataSource;
