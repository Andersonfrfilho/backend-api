import type { KeycloakClientInterface, KeycloakTokenResponse } from '@adatechnology/auth-keycloak';
import { KEYCLOAK_CLIENT } from '@adatechnology/auth-keycloak';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakDemoService {
  constructor(
    @Inject(KEYCLOAK_CLIENT)
    private readonly keycloakClient: KeycloakClientInterface,
  ) {}

  getAccessToken(): Promise<string> {
    return this.keycloakClient.getAccessToken();
  }

  getUserInfo(token: string): Promise<Record<string, unknown>> {
    return this.keycloakClient.getUserInfo(token);
  }

  validateToken(token: string): Promise<boolean> {
    return this.keycloakClient.validateToken(token);
  }

  refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    return this.keycloakClient.refreshToken(refreshToken);
  }

  loginWithCredentials(username: string, password: string): Promise<KeycloakTokenResponse> {
    return this.keycloakClient.getTokenWithCredentials({ username, password });
  }

  async clearTokenCache(): Promise<void> {
    this.keycloakClient.clearTokenCache();
  }
}
