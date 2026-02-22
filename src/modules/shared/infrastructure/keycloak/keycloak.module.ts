import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SharedInfrastructureContextModule } from '@modules/shared/infrastructure/context/context.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

import { RequestContextService } from '../context/request-context.service';
import { SharedInfrastructureProviderHttpModule } from '../providers/http/http.module';

import { KeycloakClient } from './keycloak.client';
import { KeycloakHttpInterceptor } from './keycloak.http.interceptor';
import { KeycloakConfig } from './keycloak.interface';
import { KEYCLOAK_CONFIG } from './keycloak.token';

/**
 * Keycloak module configuration
 */
export const createKeycloakConfig = (configService: ConfigService): KeycloakConfig => ({
  baseUrl: configService.get<string>('KEYCLOAK_BASE_URL', 'http://localhost:8081'),
  realm: configService.get<string>('KEYCLOAK_REALM', 'BACKEND'),
  credentials: {
    clientId: configService.get<string>('KEYCLOAK_CLIENT_ID', 'backend-api'),
    clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET', 'backend-api-secret'),
    grantType: 'client_credentials', // Default to client credentials
  },
});

/**
 * Keycloak infrastructure module
 */
@Module({
  imports: [
    SharedInfrastructureProviderHttpModule,
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureContextModule,
  ],
  providers: [
    {
      provide: KEYCLOAK_CONFIG,
      useFactory: createKeycloakConfig,
      inject: [ConfigService],
    },
    {
      provide: KeycloakClient,
      useFactory: (
        config: KeycloakConfig,
        httpProvider: any,
        loggerProvider: any,
        requestContext: any,
      ) => new KeycloakClient(config, httpProvider, loggerProvider, requestContext),
      inject: [KEYCLOAK_CONFIG, 'HttpProvider', LOG_PROVIDER, RequestContextService],
    },
    {
      provide: KeycloakHttpInterceptor,
      useFactory: (keycloakClient: KeycloakClient) => new KeycloakHttpInterceptor(keycloakClient),
      inject: [KeycloakClient],
    },
  ],
  exports: [KeycloakClient, KeycloakHttpInterceptor],
})
export class SharedInfrastructureKeycloakModule {}
