export const buildKeycloakConfigFromEnv = () => ({
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8081',
  realm: process.env.KEYCLOAK_REALM || 'BACKEND',
  credentials: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'backend-api',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || 'backend-api-secret',
    grantType: (process.env.KEYCLOAK_GRANT_TYPE as any) || 'client_credentials',
  },
});
