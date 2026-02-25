import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from '@modules/auth/application/use-cases/auth.use-cases.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.token';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { MockApiClientService } from '@modules/auth/application/mock-api-client.service';
import { AuthenticatedHttpProviderModule } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider.module';
import { AuthenticatedHttpProvider } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider';
import { AUTHENTICATED_HTTP_PROVIDER } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider.token';
import { MockApiProvider } from '@modules/shared/infrastructure/providers/mock-api/mock-api.provider';
import { AUTHENTICATED_MOCK_API_PROVIDER } from '@modules/auth/infrastructure/providers/mock-api/authenticated.mock-api.provider.token';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    AuthApplicationUseCaseModule,
    AuthenticatedHttpProviderModule,
  ],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      useClass: AuthLoginSessionService,
    },
    {
      provide: AUTHENTICATED_MOCK_API_PROVIDER,
      useFactory: (authenticatedHttp: AuthenticatedHttpProvider) =>
        new MockApiProvider(authenticatedHttp),
      inject: [AUTHENTICATED_HTTP_PROVIDER],
    },
    MockApiClientService,
  ],
  exports: [
    AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
    MockApiClientService,
    AUTHENTICATED_MOCK_API_PROVIDER,
  ],
})
export class AuthInfrastructureServiceModule {}
