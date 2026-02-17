# Keycloak Integration

This module provides Keycloak authentication integration with automatic token management and HTTP interceptors.

## Features

- **Automatic Token Management**: Automatically fetches and caches access tokens
- **Token Refresh**: Handles token expiration and automatic refresh
- **HTTP Interceptors**: Automatically adds Bearer tokens to HTTP requests
- **401 Handling**: Automatically retries requests with refreshed tokens on 401 responses

## Docker Setup

The Keycloak service is included in the `docker-compose.yml`:

```yaml
keycloak:
  image: quay.io/keycloak/keycloak:25.0
  environment:
    KEYCLOAK_ADMIN: admin
    KEYCLOAK_ADMIN_PASSWORD: admin
    # ... other config
  ports:
    - '8080:8080'
```

## Environment Variables

Add these to your `.env` file:

```env
# Keycloak Configuration
KEYCLOAK_PORT=8080
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_DB_USER=keycloak
KEYCLOAK_DB_PASSWORD=keycloak
KEYCLOAK_REALM=master
KEYCLOAK_CLIENT_ID=backend-api
KEYCLOAK_CLIENT_SECRET=backend-api-secret
KEYCLOAK_BASE_URL=http://localhost:8080
```

## Usage

### Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { KeycloakClient } from '@shared/infrastructure/keycloak/keycloak.client';

@Injectable()
export class MyService {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  async makeAuthenticatedRequest() {
    const token = await this.keycloakClient.getAccessToken();

    // Use token in your requests
    const response = await this.httpProvider.get('/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
```

### With HTTP Interceptor (Recommended)

When you import the `SharedInfrastructureKeycloakModule`, the HTTP interceptor is automatically configured:

```typescript
import { Module } from '@nestjs/common';
import { SharedInfrastructureKeycloakModule } from '@shared/infrastructure/keycloak/keycloak.module';

@Module({
  imports: [SharedInfrastructureKeycloakModule],
  providers: [MyService],
})
export class MyModule {}
```

Now all HTTP requests (except Keycloak itself) will automatically include the Bearer token:

```typescript
@Injectable()
export class MyService {
  constructor(private readonly httpProvider: HttpProvider) {}

  async makeRequest() {
    // Token is automatically added by interceptor
    const response = await this.httpProvider.get('/api/protected');
    return response.data;
  }
}
```

## Keycloak Client Methods

### `getAccessToken()`

Gets a valid access token, using cache when possible.

```typescript
const token = await keycloakClient.getAccessToken();
```

### `refreshToken(refreshToken)`

Refreshes an access token using a refresh token.

```typescript
const newTokens = await keycloakClient.refreshToken(refreshToken);
```

### `validateToken(token)`

Validates if a token is still active.

```typescript
const isValid = await keycloakClient.validateToken(token);
```

### `getUserInfo(token)`

Gets user information from a valid token.

```typescript
const userInfo = await keycloakClient.getUserInfo(token);
```

## Configuration Options

### Client Credentials Flow (Default)

```typescript
const config: KeycloakConfig = {
  baseUrl: 'http://localhost:8080',
  realm: 'master',
  credentials: {
    clientId: 'backend-api',
    clientSecret: 'backend-api-secret',
    grantType: 'client_credentials',
  },
};
```

### Password Flow

```typescript
const config: KeycloakConfig = {
  baseUrl: 'http://localhost:8080',
  realm: 'master',
  credentials: {
    clientId: 'backend-api',
    clientSecret: 'backend-api-secret',
    username: 'user@example.com',
    password: 'password',
    grantType: 'password',
  },
};
```

## Keycloak Admin Console

After starting the containers, access the Keycloak admin console at:

- **URL**: http://localhost:8080
- **Username**: admin (or `KEYCLOAK_ADMIN_USER`)
- **Password**: admin (or `KEYCLOAK_ADMIN_PASSWORD`)

## Setting up a Client

1. Go to the Keycloak admin console
2. Select your realm (default: master)
3. Go to "Clients" → "Create client"
4. Set Client ID to match `KEYCLOAK_CLIENT_ID`
5. Choose "OpenID Connect" as client type
6. Configure authentication flow as needed
7. Set Client authentication to "On" if using client secret
8. Add client secret matching `KEYCLOAK_CLIENT_SECRET`

## Troubleshooting

### Token Cache Issues

If you encounter authentication issues, you can clear the token cache:

```typescript
keycloakClient.clearTokenCache();
```

### Interceptor Conflicts

The interceptor only adds tokens to requests that don't already have an Authorization header. If you need custom token handling, set the header manually.

### Network Issues

Ensure Keycloak is running and accessible at the configured `KEYCLOAK_BASE_URL`.
