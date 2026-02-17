import { Injectable } from '@nestjs/common';

import { HttpProvider } from '../providers/http/http.provider';

import type {
  KeycloakClientInterface,
  KeycloakConfig,
  KeycloakCredentials,
  KeycloakTokenResponse,
} from './keycloak.interface';

/**
 * Keycloak client implementation
 */
@Injectable()
export class KeycloakClient implements KeycloakClientInterface {
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(
    private readonly config: KeycloakConfig,
    private readonly httpProvider: HttpProvider,
  ) {}

  /**
   * Get access token with caching
   */
  async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    // Get new token
    const tokenResponse = await this.requestToken();
    const expiresAt = Date.now() + (tokenResponse.expires_in - 60) * 1000; // Subtract 60 seconds for safety

    this.tokenCache = {
      token: tokenResponse.access_token,
      expiresAt,
    };

    return tokenResponse.access_token;
  }

  /**
   * Request new token from Keycloak
   */
  private async requestToken(): Promise<KeycloakTokenResponse> {
    const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;

    const data = new URLSearchParams();
    data.append('client_id', this.config.credentials.clientId);
    data.append('grant_type', this.config.credentials.grantType);

    if (this.config.credentials.clientSecret) {
      data.append('client_secret', this.config.credentials.clientSecret);
    }

    if (this.config.credentials.grantType === 'password') {
      if (this.config.credentials.username && this.config.credentials.password) {
        data.append('username', this.config.credentials.username);
        data.append('password', this.config.credentials.password);
      }
    }

    const response = await this.httpProvider.post<KeycloakTokenResponse>(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    } as any);

    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;

    const data = new URLSearchParams();
    data.append('client_id', this.config.credentials.clientId);
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken);

    if (this.config.credentials.clientSecret) {
      data.append('client_secret', this.config.credentials.clientSecret);
    }

    const response = await this.httpProvider.post<KeycloakTokenResponse>(tokenUrl, data, {
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Update cache
    const expiresAt = Date.now() + (response.data.expires_in - 60) * 1000;
    this.tokenCache = {
      token: response.data.access_token,
      expiresAt,
    };

    return response.data;
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const introspectUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token/introspect`;

      const data = new URLSearchParams();
      data.append('token', token);
      data.append('client_id', this.config.credentials.clientId);

      if (this.config.credentials.clientSecret) {
        data.append('client_secret', this.config.credentials.clientSecret);
      }

      const response = await this.httpProvider.post(introspectUrl, data, {
        url: introspectUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      } as any);

      return (response.data as any).active === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(token: string): Promise<any> {
    const userInfoUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/userinfo`;

    const response = await this.httpProvider.get(userInfoUrl, {
      url: userInfoUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } as any);

    return response.data;
  }

  /**
   * Clear token cache
   */
  clearTokenCache(): void {
    this.tokenCache = null;
  }
}
