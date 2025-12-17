import { DataSource } from 'typeorm';

import {
  BenchmarkNanoidEntity,
  BenchmarkSnowflakeEntity,
  BenchmarkUUIDv4Entity,
  BenchmarkUUIDv7Entity,
} from '@app/modules/benchmark/domain/entities/benchmark.entities';
import { Address } from '@app/modules/shared/domain/entities/address.entity';
import { Phone } from '@app/modules/shared/domain/entities/phone.entity';
import { UserAddress } from '@app/modules/shared/domain/entities/user-address.entity';
import { User } from '@app/modules/shared/domain/entities/user.entity';
import { getDatabaseConfig } from '@config/database-config';

import { migrations } from '../../migrations/index';

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

  entities: [
    User,
    Phone,
    Address,
    UserAddress,
    BenchmarkUUIDv7Entity,
    BenchmarkNanoidEntity,
    BenchmarkSnowflakeEntity,
    BenchmarkUUIDv4Entity,
  ],
  migrations,
});

export default PostgresDataSource;
