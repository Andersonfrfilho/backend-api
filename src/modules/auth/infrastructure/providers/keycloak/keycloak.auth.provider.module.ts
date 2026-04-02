import { KEYCLOAK_CLIENT } from '@adatechnology/auth-keycloak';
import type { KeycloakClientInterface } from '@adatechnology/auth-keycloak';
import { Module } from '@nestjs/common';

import { SharedInfrastructureKeycloakModule } from '@modules/shared/infrastructure/keycloak/keycloak.module';

import { AUTH_PROVIDER_TOKEN } from '../../../domain/auth.token';

/**
 * Adapter module that exposes the shared `KeycloakClient` as the application's `AUTH_PROVIDER_TOKEN`
 */
@Module({
  imports: [SharedInfrastructureKeycloakModule],
  providers: [
    {
      provide: AUTH_PROVIDER_TOKEN,
      useFactory: (keycloakClient: KeycloakClientInterface & { clearTokenCache?: () => void }) => ({
        getAccessToken: () => keycloakClient.getAccessToken(),
        refreshToken: (refreshToken: string) => keycloakClient.refreshToken(refreshToken),
        validateToken: (token: string) => keycloakClient.validateToken(token),
        getUserInfo: (token: string) => keycloakClient.getUserInfo(token),
        clearTokenCache: () => keycloakClient.clearTokenCache?.(),
      }),
      inject: [KEYCLOAK_CLIENT],
    },
  ],
  exports: [AUTH_PROVIDER_TOKEN],
})
export class KeycloakAuthProviderModule {}
