import { Inject, Injectable } from '@nestjs/common';

import type { AuthProviderInterface, AuthTokenResponse, UserInfo } from '../domain/auth.interface';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';
import { AUTH_PROVIDER_TOKEN } from '../domain/auth.token';

/**
 * Main authentication provider that delegates to specific implementations
 */
@Injectable()
export class AuthProvider implements AuthProviderInterface {
  constructor(
    @Inject(AUTH_PROVIDER_TOKEN)
    private readonly authProvider: AuthProviderInterface,
    @Inject(LOG_PROVIDER) private readonly loggerProvider?: any,
  ) {}

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string> {
    try {
      // Log delegation for visibility
      (this as any).loggerProvider?.info?.({
        message: 'AuthProvider.getAccessToken - delegating to underlying provider',
      });
    } catch (e) {}
    return this.authProvider.getAccessToken();
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return this.authProvider.refreshToken(refreshToken);
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    return this.authProvider.validateToken(token);
  }

  /**
   * Get user info
   */
  async getUserInfo(token: string): Promise<UserInfo> {
    return this.authProvider.getUserInfo(token);
  }

  /**
   * Clear token cache
   */
  clearTokenCache(): void {
    return this.authProvider.clearTokenCache();
  }
}
