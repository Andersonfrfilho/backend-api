import { Inject, Injectable } from '@nestjs/common';

import type { AuthProviderInterface, AuthTokenResponse, UserInfo } from '../domain/auth.interface';
import { AUTH_PROVIDER_TOKEN } from '../domain/auth.token';

/**
 * Main authentication provider that delegates to specific implementations
 */
@Injectable()
export class AuthProvider implements AuthProviderInterface {
  constructor(
    @Inject(AUTH_PROVIDER_TOKEN)
    private readonly authProvider: AuthProviderInterface,
  ) {}

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string> {
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
