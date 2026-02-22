import { Inject, Injectable } from '@nestjs/common';

import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

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
    @Inject(LOG_PROVIDER) private readonly loggerProvider?: any,
  ) {}

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string> {
    try {
      // Log delegation for visibility. usamos o logger injetado quando disponível.
      this.loggerProvider?.info?.({
        message: 'AuthProvider.getAccessToken - delegating to underlying provider',
      });
    } catch (e) {
      // Se ocorrer erro durante o log, tentamos registrar o erro (fallback para console se necessário)
      try {
        this.loggerProvider?.error?.({
          message: 'AuthProvider.getAccessToken - error while logging delegation',
          error: e?.message ?? String(e),
        });
      } catch {
        console.error('AuthProvider.getAccessToken - logging failed:', e);
      }
    }

    // Delega para o provedor subjacente que implementa a lógica real de obtenção de token
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
