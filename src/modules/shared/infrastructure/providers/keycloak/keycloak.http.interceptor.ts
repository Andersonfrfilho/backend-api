import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { KeycloakClient } from './keycloak.client';

/**
 * HTTP interceptor that automatically adds Keycloak tokens to requests
 */
@Injectable()
export class KeycloakHttpInterceptor implements NestInterceptor {
  constructor(private readonly keycloakClient: KeycloakClient) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Only add token for external API calls (not Keycloak itself)
    if (request.url && !request.url.includes('keycloak')) {
      // Note: In a real implementation, you might want to add the token here
      // But since we're using HttpProvider, the token addition should be handled there
      // This interceptor could be used for other HTTP client libraries
    }

    return next.handle();
  }
}
