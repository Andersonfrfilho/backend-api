import { KeycloakModule } from '@adatechnology/auth-keycloak';
import { CacheModule } from '@adatechnology/cache';
import { HttpModule } from '@adatechnology/http-client';
import { LoggerModule } from '@adatechnology/logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';

import { ConfigModule } from '@config/config.module';
import { buildKeycloakConfigFromEnv } from '@config/keycloak.config';
import { AuthModule } from '@modules/auth/auth.module';
import { ErrorModule } from '@modules/error/error.module';
import { HealthModule } from '@modules/health/health.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { SecurityHeadersMiddleware } from '@modules/shared/infrastructure/middleware/security-headers.middleware';

import * as tsConfig from '../tsconfig.json';

import { BenchmarkModule } from './modules/benchmark/benchmark.module';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

const compilerOptions = tsConfig.compilerOptions;
tsConfigPathsRegister({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
});

@Module({
  imports: [
    ConfigModule,
    // Register logger centrally in AppModule
    LoggerModule.forRoot({ level: process.env.LOG_LEVEL || 'info' }),
    CacheModule.forRoot({ isGlobal: true }),
    HttpModule.forRoot({}, { provide: 'HTTP_PROVIDER' }),
    // Register Keycloak centrally in AppModule
    KeycloakModule.forRoot(buildKeycloakConfigFromEnv()),
    NotificationModule,
    SharedModule,
    ErrorModule,
    HealthModule,
    AuthModule,
    UserModule,
    BenchmarkModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
  }
}
