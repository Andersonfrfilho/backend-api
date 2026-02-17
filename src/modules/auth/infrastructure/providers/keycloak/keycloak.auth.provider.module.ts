import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SharedInfrastructureProviderHttpModule } from '@modules/shared/infrastructure/providers/http/http.module';

import type { AuthConfig, AuthProviderInterface } from '../../../domain/auth.interface';
import { AUTH_CONFIG_TOKEN, AUTH_PROVIDER_TOKEN } from '../../../domain/auth.token';

import { KeycloakAuthProvider } from './keycloak.auth.provider';

/**
 * Keycloak auth provider configuration
 */
export const createKeycloakAuthConfig = (configService: ConfigService): AuthConfig => ({
  provider: 'keycloak',
  baseUrl: configService.get<string>('KEYCLOAK_BASE_URL', 'http://localhost:8080'),
  realm: configService.get<string>('KEYCLOAK_REALM', 'BACKEND'),
  credentials: {
    clientId: configService.get<string>('KEYCLOAK_CLIENT_ID', 'backend-api'),
    clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET', 'backend-api-secret'),
    grantType: 'client_credentials', // Default to client credentials
  },
});

/**
 * Keycloak auth provider module
 */
@Module({
  imports: [SharedInfrastructureProviderHttpModule],
  providers: [
    {
      provide: AUTH_CONFIG_TOKEN,
      useFactory: createKeycloakAuthConfig,
      inject: [ConfigService],
    },
    {
      provide: AUTH_PROVIDER_TOKEN,
      useFactory: (config: AuthConfig, httpProvider: any) =>
        new KeycloakAuthProvider(config, httpProvider),
      inject: [AUTH_CONFIG_TOKEN, 'HttpProvider'],
    },
  ],
  exports: [AUTH_PROVIDER_TOKEN],
})
export class KeycloakAuthProviderModule {}
