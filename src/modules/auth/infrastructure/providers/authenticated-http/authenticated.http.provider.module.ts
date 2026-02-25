import { Module, forwardRef } from '@nestjs/common';

import { AuthApplicationModule } from '@modules/auth/auth.application.module';
import type { AuthProviderInterface } from '@modules/auth/domain/auth.interface';
import { AUTH_PROVIDER_TOKEN } from '@modules/auth/domain/auth.token';
import type { LogProviderInterface } from '@modules/shared/domain/interfaces/log.interface';
import { SharedInfrastructureProviderHttpModule } from '@modules/shared/infrastructure/providers/http/http.module';
import { HttpProvider } from '@modules/shared/infrastructure/providers/http/http.provider';
import { HTTP_PROVIDER } from '@modules/shared/infrastructure/providers/http/http.token';
import { attachAuthTokenInterceptor } from '@modules/shared/infrastructure/providers/http/interceptors/interceptor.http.client.auth.token';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

import { AuthenticatedHttpProvider } from './authenticated.http.provider';
import { AUTHENTICATED_HTTP_PROVIDER } from './authenticated.http.provider.token';

/**
 * Authenticated HTTP provider module
 */
@Module({
  imports: [
    SharedInfrastructureProviderHttpModule,
    SharedInfrastructureProviderLogModule,
    forwardRef(() => AuthApplicationModule),
  ],
  providers: [
    {
      provide: AUTHENTICATED_HTTP_PROVIDER,
      useFactory: (
        httpProvider: HttpProvider,
        authProvider: AuthProviderInterface,
        loggerProvider: LogProviderInterface,
      ) => {
        // attach axios interceptor if underlying implementation exposes an axios instance
        try {
          const axiosInstance = httpProvider.getAxiosInstance?.();
          if (axiosInstance) {
            attachAuthTokenInterceptor(axiosInstance, authProvider, loggerProvider);
          }
        } catch (e) {
          // ignore if underlying provider shape is different
        }

        return new AuthenticatedHttpProvider(httpProvider, authProvider, loggerProvider);
      },
      inject: [HTTP_PROVIDER, AUTH_PROVIDER_TOKEN, LOG_PROVIDER],
    },
  ],
  exports: [AUTHENTICATED_HTTP_PROVIDER],
})
export class AuthenticatedHttpProviderModule {}
