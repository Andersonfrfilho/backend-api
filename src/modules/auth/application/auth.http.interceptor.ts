import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthProvider } from './auth.provider';

/**
 * HTTP interceptor that automatically adds authentication tokens to outgoing requests
 */
@Injectable()
export class AuthHttpInterceptor implements NestInterceptor {
  constructor(private readonly authProvider: AuthProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // For outgoing HTTP requests (using HttpService or Axios)
    // This interceptor modifies the request config to add the token

    // Note: This assumes you're using NestJS HttpService or Axios
    // The request object here is the Axios request config

    const request = context.switchToHttp().getRequest();

    // Only add token for external API calls (not auth provider itself)
    if (request.url && !this.isAuthProviderUrl(request.url)) {
      // Add token asynchronously
      return new Observable((subscriber) => {
        this.authProvider
          .getAccessToken()
          .then((token) => {
            if (token) {
              request.headers = {
                ...request.headers,
                Authorization: `Bearer ${token}`,
              };
            }
            // Continue with the modified request
            next.handle().subscribe(subscriber);
          })
          .catch((error) => {
            subscriber.error(error);
          });
      });
    }

    return next.handle();
  }

  /**
   * Check if URL belongs to auth provider (to avoid adding tokens to auth requests)
   */
  private isAuthProviderUrl(url: string): boolean {
    // Add logic to detect auth provider URLs
    return url.includes('keycloak') || url.includes('auth') || url.includes('token');
  }
}
