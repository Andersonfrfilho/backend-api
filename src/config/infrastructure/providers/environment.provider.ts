import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentProviderInterface } from '@config/domain/interfaces/environment.interface';

@Injectable()
export class EnvironmentProvider implements EnvironmentProviderInterface {
  constructor(private configService: ConfigService) {}
  // ============================================
  // API Configuration
  // ============================================

  get port(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get nodeEnv(): 'development' | 'production' | 'test' {
    return this.configService.getOrThrow<'development' | 'production' | 'test'>('NODE_ENV');
  }

  get apiContainerName(): string {
    return `${this.projectName}_api`;
  }

  get projectName(): string {
    return this.configService.getOrThrow<string>('PROJECT_NAME');
  }

  get baseUrl(): string {
    const baseUrl = this.configService.get<string>('BASE_URL');
    return baseUrl ?? `http://localhost:${this.port}`;
  }

  // ============================================
  // Database Configuration
  // ============================================

  get databasePostgresHost(): string {
    return this.configService.getOrThrow<string>('DATABASE_POSTGRES_HOST');
  }

  get databasePostgresPort(): number {
    return this.configService.getOrThrow<number>('DATABASE_POSTGRES_PORT');
  }

  get databasePostgresName(): string {
    return this.configService.getOrThrow<string>('DATABASE_POSTGRES_NAME');
  }

  get databasePostgresUser(): string {
    return this.configService.getOrThrow<string>('DATABASE_POSTGRES_USER');
  }

  get databasePostgresPassword(): string {
    return this.configService.getOrThrow<string>('DATABASE_POSTGRES_PASSWORD');
  }

  get databasePostgresUrl(): string {
    return `postgresql://${this.databasePostgresUser}:${this.databasePostgresPassword}@${this.databasePostgresHost}:${this.databasePostgresPort}/${this.databasePostgresName}`;
  }

  get databasePostgresSynchronize(): boolean {
    return this.configService.getOrThrow<boolean>('DATABASE_POSTGRES_SYNCHRONIZE');
  }

  get databasePostgresLogging(): boolean {
    const logging = this.configService.get<boolean>('DATABASE_POSTGRES_LOGGING');
    if (logging !== undefined) {
      return logging;
    }
    return this.isDevelopment();
  }

  get databasePostgresTimezone(): string {
    return this.configService.getOrThrow<string>('DB_TIMEZONE');
  }

  // ============================================
  // Environment Helpers
  // ============================================

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get baseUrlDevelopment(): string {
    const baseUrl = this.configService.get<string>('BASE_URL_DEVELOPMENT');
    return baseUrl ?? `http://localhost:${this.port}`;
  }

  get baseUrlStaging(): string {
    const baseUrl = this.configService.get<string>('BASE_URL_STAGING');
    return baseUrl ?? `http://localhost:${this.port}`;
  }

  get baseUrlProduction(): string {
    const baseUrl = this.configService.get<string>('BASE_URL_PRODUCTION');
    return baseUrl ?? `http://localhost:${this.port}`;
  }

  getAllConfig() {
    return {
      api: {
        port: this.port,
        baseUrl: this.baseUrl,
        containerName: this.apiContainerName,
      },
      database: {
        host: this.databasePostgresHost,
        port: this.databasePostgresPort,
        name: this.databasePostgresName,
        user: this.databasePostgresUser,
        timezone: this.databasePostgresTimezone,
        synchronize: this.databasePostgresSynchronize,
        logging: this.databasePostgresLogging,
      },
      app: {
        environment: this.nodeEnv,
        isDevelopment: this.isDevelopment(),
        isProduction: this.isProduction(),
        isTest: this.isTest(),
      },
    };
  }
}
