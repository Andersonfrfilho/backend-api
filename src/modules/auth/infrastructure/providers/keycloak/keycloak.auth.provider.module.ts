import { Module } from '@nestjs/common';
import { SharedInfrastructureKeycloakModule } from '@modules/shared/infrastructure/keycloak/keycloak.module';
import { KeycloakClient } from '@modules/shared/infrastructure/keycloak/keycloak.client';
import { AUTH_PROVIDER_TOKEN } from '../../../domain/auth.token';

/**
 * Adapter module that exposes the shared `KeycloakClient` as the application's `AUTH_PROVIDER_TOKEN`
 */
@Module({
  imports: [SharedInfrastructureKeycloakModule],
  providers: [
    {
      provide: AUTH_PROVIDER_TOKEN,
      useFactory: (keycloakClient: KeycloakClient) => ({
        getAccessToken: () => keycloakClient.getAccessToken(),
        refreshToken: (refreshToken: string) => keycloakClient.refreshToken(refreshToken),
        validateToken: (token: string) => keycloakClient.validateToken(token),
        getUserInfo: (token: string) => keycloakClient.getUserInfo(token),
        clearTokenCache: () => keycloakClient.clearTokenCache(),
      }),
      inject: [KeycloakClient],
    },
  ],
  exports: [AUTH_PROVIDER_TOKEN],
})
export class KeycloakAuthProviderModule {}
