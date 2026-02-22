import { Inject, Injectable } from '@nestjs/common';

import type { LogProviderInterface } from '@modules/shared/domain';
import { RequestContextService } from '@modules/shared/infrastructure/context/request-context.service';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

import { HttpProvider } from '../providers/http/http.provider';

import type {
  KeycloakClientInterface,
  KeycloakConfig,
  KeycloakTokenResponse,
} from './keycloak.interface';

/**
 * Keycloak client implementation
 */
@Injectable()
export class KeycloakClient implements KeycloakClientInterface {
  private tokenCache: { token: string; expiresAt: number } | null = null;
  // Promise used to deduplicate concurrent token requests (single-flight)
  private tokenPromise?: Promise<string> | null = null;

  constructor(
    private readonly config: KeycloakConfig,
    private readonly httpProvider: HttpProvider,
    @Inject(LOG_PROVIDER) private readonly loggerProvider: LogProviderInterface,
    @Inject(RequestContextService) private readonly requestContext?: RequestContextService,
  ) {}

  /**
   * Get access token with caching
   */
  async getAccessToken(): Promise<string> {
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'KeycloakClient.getAccessToken - start',
      context: 'KeycloakClient - getAccessToken',
      params: { realm: this.config.realm, caller },
    });

    // Check if we have a valid cached token
    const now = Date.now();
    if (this.tokenCache && now < this.tokenCache.expiresAt) {
      // Cache hit
      const masked = KeycloakClient.maskToken(this.tokenCache.token);
      this.loggerProvider?.info({
        message: 'KeycloakClient.getAccessToken - cache hit',
        context: 'KeycloakClient - getAccessToken',
        params: { realm: this.config.realm, caller, source: 'cache', token: masked },
      });
      return this.tokenCache.token;
    }

    // If a token request is already in flight, reuse its promise
    if (this.tokenPromise) {
      this.loggerProvider?.info({
        message: 'KeycloakClient.getAccessToken - awaiting inflight tokenPromise',
        context: 'KeycloakClient - getAccessToken',
        params: { realm: this.config.realm, caller },
      });
      return this.tokenPromise;
    }

    // Get new token and cache it (single-flight)
    this.tokenPromise = (async (): Promise<string> => {
      try {
        const tokenResponse = await this.requestToken();
        const expiresAt = Date.now() + (tokenResponse.expires_in - 60) * 1000; // Subtract 60 seconds for safety

        this.tokenCache = {
          token: tokenResponse.access_token,
          expiresAt,
        };

        const masked = KeycloakClient.maskToken(tokenResponse.access_token);
        this.loggerProvider?.info({
          message: 'KeycloakClient.getAccessToken - token acquired',
          context: 'KeycloakClient - getAccessToken',
          params: { realm: this.config.realm, caller, source: 'keycloak', token: masked },
        });

        return tokenResponse.access_token;
      } finally {
        // clear inflight promise after resolution so subsequent calls can check cache
        this.tokenPromise = null;
      }
    })();

    return this.tokenPromise;
  }

  /**
   * Request token using provided user credentials (password grant)
   */
  async getTokenWithCredentials(username: string, password: string) {
    const methodContext = 'KeycloakClient - getTokenWithCredentials';
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'KeycloakClient.getTokenWithCredentials - start',
      context: methodContext,
      params: { username, realm: this.config.realm, caller },
    });

    const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;

    const data = new URLSearchParams();
    data.append('client_id', this.config.credentials.clientId);
    data.append('grant_type', 'password');
    data.append('username', username);
    data.append('password', password);

    if (this.config.credentials.clientSecret) {
      data.append('client_secret', this.config.credentials.clientSecret);
    }

    try {
      const response = await this.httpProvider.post<any>(tokenUrl, data, {
        url: tokenUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      } as any);

      return response.data;
    } catch (error: any) {
      const safeError = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response
          ? { status: error.response.status, data: error.response.data }
          : undefined,
      };
      this.loggerProvider?.error({
        message: 'KeycloakClient.getTokenWithCredentials - error',
        context: methodContext,
        params: { username, realm: this.config.realm, caller, error: safeError },
      });
      throw error;
    }
  }

  /**
   * Request new token from Keycloak
   */
  private async requestToken(): Promise<KeycloakTokenResponse> {
    const methodContext = 'KeycloakClient - requestToken';
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'KeycloakClient.requestToken - start',
      context: methodContext,
      params: { grantType: this.config.credentials.grantType, realm: this.config.realm, caller },
    });

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

    try {
      const response = await this.httpProvider.post<KeycloakTokenResponse>(tokenUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      } as any);

      return response.data;
    } catch (error: any) {
      const caller = this.requestContext?.get('caller');
      const safeError = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response
          ? { status: error.response.status, data: error.response.data }
          : undefined,
      };
      this.loggerProvider?.error({
        message: 'KeycloakClient.requestToken - error',
        context: methodContext,
        params: {
          grantType: this.config.credentials.grantType,
          realm: this.config.realm,
          caller,
          error: safeError,
        },
      });
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    const methodContext = 'KeycloakClient - refreshToken';
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'KeycloakClient.refreshToken - start',
      context: methodContext,
      params: { realm: this.config.realm, caller },
    });

    const tokenUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`;

    const data = new URLSearchParams();
    data.append('client_id', this.config.credentials.clientId);
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', refreshToken);

    if (this.config.credentials.clientSecret) {
      data.append('client_secret', this.config.credentials.clientSecret);
    }

    try {
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

      const masked = KeycloakClient.maskToken(response.data.access_token);
      this.loggerProvider?.info({
        message: 'KeycloakClient.refreshToken - token refreshed and cached',
        context: methodContext,
        params: { realm: this.config.realm, caller, source: 'refresh', token: masked },
      });

      return response.data;
    } catch (error: any) {
      const caller = this.requestContext?.get('caller');
      const safeError = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response
          ? { status: error.response.status, data: error.response.data }
          : undefined,
      };
      this.loggerProvider?.error({
        message: 'KeycloakClient.refreshToken - error',
        context: methodContext,
        params: { realm: this.config.realm, caller, error: safeError },
      });
      throw error;
    }
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const methodContext = 'KeycloakClient - validateToken';
      const caller = this.requestContext?.get('caller');
      this.loggerProvider?.info({
        message: 'KeycloakClient.validateToken - start',
        context: methodContext,
        params: { realm: this.config.realm, caller },
      });

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
    } catch (error: any) {
      const caller = this.requestContext?.get('caller');
      const safeError = { message: error?.message, name: error?.name, code: error?.code };
      this.loggerProvider?.error({
        message: 'KeycloakClient.validateToken - error',
        context: 'KeycloakClient - validateToken',
        params: { realm: this.config.realm, caller, error: safeError },
      });
      return false;
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(token: string): Promise<any> {
    const methodContext = 'KeycloakClient - getUserInfo';
    const caller = this.requestContext?.get('caller');
    this.loggerProvider?.info({
      message: 'KeycloakClient.getUserInfo - start',
      context: methodContext,
      params: { realm: this.config.realm, caller },
    });

    const userInfoUrl = `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/userinfo`;

    try {
      const response = await this.httpProvider.get(userInfoUrl, {
        url: userInfoUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as any);

      return response.data;
    } catch (error: any) {
      const caller = this.requestContext?.get('caller');
      const safeError = {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        response: error?.response
          ? { status: error.response.status, data: error.response.data }
          : undefined,
      };
      this.loggerProvider?.error({
        message: 'KeycloakClient.getUserInfo - error',
        context: methodContext,
        params: { realm: this.config.realm, caller, error: safeError },
      });
      throw error;
    }
  }

  /**
   * Clear token cache
   */
  clearTokenCache(): void {
    this.tokenCache = null;
  }

  /**
   * Mask token for safe logging (show only initial characters)
   */
  private static maskToken(token: string, visibleChars = 8): string {
    if (!token || typeof token !== 'string') return '';
    return token.length <= visibleChars ? token : `${token.slice(0, visibleChars)}...`;
  }
}
