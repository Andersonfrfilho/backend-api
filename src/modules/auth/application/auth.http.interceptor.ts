import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthProvider } from './auth.provider';

/**
 * HTTP interceptor that automatically adds authentication tokens to requests
 */
@Injectable()
export class AuthHttpInterceptor implements NestInterceptor {
  constructor(private readonly authProvider: AuthProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Only add token for external API calls (not auth provider itself)
    if (request.url && !this.isAuthProviderUrl(request.url)) {
      // Note: In a real implementation, you might want to add the token here
      // But since we're using HttpProvider, the token addition should be handled there
      // This interceptor could be used for other HTTP client libraries
    }

    return next.handle();
  }

  /**
   * Check if URL belongs to auth provider (to avoid adding tokens to auth requests)
   */
  private isAuthProviderUrl(url: string): boolean {
    // Add logic to detect auth provider URLs
    return url.includes('keycloak') || url.includes('auth');
  }
}
