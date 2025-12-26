import 'dotenv/config';

import { ConfigErrorFactory } from '@modules/error/application/factories';

import envValidationSchema from './env.validation';
import { DatabaseConfigs } from './types';

export function getDatabaseConfig(): DatabaseConfigs {
  const { error, value } = envValidationSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    throw ConfigErrorFactory.invalidConfiguration(messages);
  }

  const {
    DATABASE_POSTGRES_HOST,
    DATABASE_POSTGRES_PORT,
    DATABASE_POSTGRES_USER,
    DATABASE_POSTGRES_PASSWORD,
    DATABASE_POSTGRES_NAME,
    DATABASE_POSTGRES_TIMEZONE,
    DATABASE_POSTGRES_LOGGING,
    DATABASE_POSTGRES_SYNCHRONIZE,

    DATABASE_MONGO_HOST,
    DATABASE_MONGO_PORT,
    DATABASE_MONGO_USERNAME,
    DATABASE_MONGO_PASSWORD,
    DATABASE_MONGO_NAME,
    DATABASE_MONGO_TIMEZONE,
    DATABASE_MONGO_LOGGING,
    DATABASE_MONGO_SYNCHRONIZE,

    DATABASE_POSTGRES_TEST_E2E_PORT,
    DATABASE_POSTGRES_TEST_E2E_NAME,
    DATABASE_POSTGRES_TEST_E2E_HOST,
    DATABASE_POSTGRES_TEST_E2E_USER,
    DATABASE_POSTGRES_TEST_E2E_PASSWORD,
    DATABASE_POSTGRES_TEST_E2E_SYNCHRONIZE,
    DATABASE_POSTGRES_TEST_E2E_LOGGING,
    DATABASE_POSTGRES_TEST_E2E_TIMEZONE,

    DATABASE_MONGO_TEST_E2E_HOST,
    DATABASE_MONGO_TEST_E2E_PORT,
    DATABASE_MONGO_TEST_E2E_USERNAME,
    DATABASE_MONGO_TEST_E2E_PASSWORD,
    DATABASE_MONGO_TEST_E2E_NAME,
    DATABASE_MONGO_TEST_E2E_TIMEZONE,
    DATABASE_MONGO_TEST_E2E_LOGGING,
    DATABASE_MONGO_TEST_E2E_SYNCHRONIZE,
  } = value;
  const isE2E = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

  if (isE2E) {
    return {
      postgres: {
        host: DATABASE_POSTGRES_TEST_E2E_HOST,
        port: DATABASE_POSTGRES_TEST_E2E_PORT,
        username: DATABASE_POSTGRES_TEST_E2E_USER,
        password: DATABASE_POSTGRES_TEST_E2E_PASSWORD,
        database: DATABASE_POSTGRES_TEST_E2E_NAME,
        timezone: DATABASE_POSTGRES_TEST_E2E_TIMEZONE,
        logging: DATABASE_POSTGRES_TEST_E2E_LOGGING ?? false,
        synchronize: DATABASE_POSTGRES_TEST_E2E_SYNCHRONIZE ?? false,
      },
      mongo: {
        host: DATABASE_MONGO_TEST_E2E_HOST,
        port: DATABASE_MONGO_TEST_E2E_PORT,
        username: DATABASE_MONGO_TEST_E2E_USERNAME,
        password: DATABASE_MONGO_TEST_E2E_PASSWORD,
        database: DATABASE_MONGO_TEST_E2E_NAME,
        timezone: DATABASE_MONGO_TEST_E2E_TIMEZONE,
        logging: DATABASE_MONGO_TEST_E2E_LOGGING ?? false,
        synchronize: DATABASE_MONGO_TEST_E2E_SYNCHRONIZE ?? false,
      },
    };
  }

  return {
    postgres: {
      host: DATABASE_POSTGRES_HOST,
      port: DATABASE_POSTGRES_PORT,
      username: DATABASE_POSTGRES_USER,
      password: DATABASE_POSTGRES_PASSWORD,
      database: DATABASE_POSTGRES_NAME,
      timezone: DATABASE_POSTGRES_TIMEZONE,
      logging: DATABASE_POSTGRES_LOGGING ?? false,
      synchronize: DATABASE_POSTGRES_SYNCHRONIZE ?? false,
    },
    mongo: {
      host: DATABASE_MONGO_HOST,
      port: DATABASE_MONGO_PORT,
      username: DATABASE_MONGO_USERNAME,
      password: DATABASE_MONGO_PASSWORD,
      database: DATABASE_MONGO_NAME,
      timezone: DATABASE_MONGO_TIMEZONE,
      logging: DATABASE_MONGO_LOGGING ?? false,
      synchronize: DATABASE_MONGO_SYNCHRONIZE ?? false,
    },
  };
}
