import { Module, forwardRef } from '@nestjs/common';

import { AuthApplicationModule } from '@modules/auth/auth.application.module';
import { SharedInfrastructureProviderHttpModule } from '@modules/shared/infrastructure/providers/http/http.module';
import { HTTP_PROVIDER } from '@modules/shared/infrastructure/providers/http/http.token';
import { attachAuthTokenInterceptor } from '@modules/shared/infrastructure/providers/http/interceptors/interceptor.http.client.auth.token';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

import { AuthenticatedHttpProvider } from './authenticated.http.provider';

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
      provide: 'AuthenticatedHttpProvider',
      useFactory: (httpProvider: any, authProvider: any, loggerProvider: any) => {
        // attach axios interceptor if underlying implementation is AxiosHttpProvider
        try {
          const axiosProvider = httpProvider.axiosHttpProvider;
          const axiosInstance =
            axiosProvider?.axiosInstance || axiosProvider?.instance || undefined;
          if (axiosInstance) {
            attachAuthTokenInterceptor(axiosInstance, authProvider, loggerProvider);
          }
        } catch (e) {
          // ignore if underlying provider shape is different
        }

        return new AuthenticatedHttpProvider(httpProvider, authProvider, loggerProvider);
      },
      inject: [HTTP_PROVIDER, 'AuthProvider', LOG_PROVIDER],
    },
  ],
  exports: ['AuthenticatedHttpProvider'],
})
export class AuthenticatedHttpProviderModule {}
