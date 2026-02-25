/**
 * Keycloak token response
 */
export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

/**
 * Keycloak client credentials
 */
export interface KeycloakCredentials {
  clientId: string;
  clientSecret: string;
  username?: string;
  password?: string;
  grantType: 'client_credentials' | 'password';
}

/**
 * Keycloak configuration
 */
export interface KeycloakConfig {
  baseUrl: string;
  realm: string;
  credentials: KeycloakCredentials;
}

/**
 * Keycloak client interface
 */
export interface KeycloakClientInterface {
  /**
   * Get access token
   */
  getAccessToken(): Promise<string>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<KeycloakTokenResponse>;

  /**
   * Validate token
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Get user info
   */
  getUserInfo(token: string): Promise<any>;
}
