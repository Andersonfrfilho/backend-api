import 'dotenv/config';
import envValidationSchema from './env.validation';

export interface DatabaseConfigValues {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  timezone: string;
  logging: boolean;
  synchronize: boolean;
}

export function getDatabaseConfig(): DatabaseConfigValues {
  const { error, value } = envValidationSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    throw new Error(`[Database Config] Validation failed: ${messages}`);
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
  } = value;

  return {
    host: DATABASE_POSTGRES_HOST,
    port: DATABASE_POSTGRES_PORT,
    username: DATABASE_POSTGRES_USER,
    password: DATABASE_POSTGRES_PASSWORD,
    database: DATABASE_POSTGRES_NAME,
    timezone: DATABASE_POSTGRES_TIMEZONE,
    logging: DATABASE_POSTGRES_LOGGING ?? false,
    synchronize: DATABASE_POSTGRES_SYNCHRONIZE ?? false,
  };
}
