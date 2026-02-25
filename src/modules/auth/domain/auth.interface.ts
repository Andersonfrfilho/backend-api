/**
 * Authentication token response
 */
export interface AuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type: string;
  scope?: string;
}

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  clientId: string;
  clientSecret?: string;
  username?: string;
  password?: string;
  grantType: 'client_credentials' | 'password' | 'refresh_token';
  refreshToken?: string;
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  provider: string; // 'keycloak', 'auth0', etc.
  baseUrl: string;
  realm?: string; // For Keycloak
  credentials: AuthCredentials;
}

/**
 * User information
 */
export interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
  roles?: string[];
  groups?: string[];
  [key: string]: any;
}

/**
 * Authentication provider interface
 */
export interface AuthProviderInterface {
  /**
   * Get access token
   */
  getAccessToken(): Promise<string>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<AuthTokenResponse>;

  /**
   * Validate token
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Get user info
   */
  getUserInfo(token: string): Promise<UserInfo>;

  /**
   * Clear token cache
   */
  clearTokenCache(): void;
}
