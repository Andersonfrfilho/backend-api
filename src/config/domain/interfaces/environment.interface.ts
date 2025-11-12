import { NodeEnv } from '../types';

export interface IEnvironment {
  readonly port: number;
  readonly nodeEnv: NodeEnv;
  readonly baseUrl: string;
  readonly apiContainerName: string;

  readonly databasePostgresHost: string;
  readonly databasePostgresPort: number;
  readonly databasePostgresName: string;
  readonly databasePostgresUser: string;
  readonly databasePostgresPassword: string;
  readonly databasePostgresUrl: string;
  readonly databasePostgresSynchronize: boolean;
  readonly databasePostgresLogging: boolean;
  readonly databasePostgresTimezone: string;

  isDevelopment(): boolean;
  isProduction(): boolean;
  isTest(): boolean;
  getAllConfig(): {
    api: {
      port: number;
      baseUrl: string;
      containerName: string;
    };
    database: {
      host: string;
      port: number;
      name: string;
      user: string;
      timezone: string;
      synchronize: boolean;
      logging: boolean;
    };
    app: {
      environment: NodeEnv;
      isDevelopment: boolean;
      isProduction: boolean;
      isTest: boolean;
    };
  };
}
