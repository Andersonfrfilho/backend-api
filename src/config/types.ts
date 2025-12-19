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

export interface DatabaseConfigs {
  postgres: DatabaseConfigValues;
  mongo: DatabaseConfigValues;
}
