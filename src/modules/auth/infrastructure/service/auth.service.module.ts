import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from '@modules/auth/application/use-cases/auth.use-cases.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.token';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { MockApiClientService } from '@modules/auth/application/mock-api-client.service';
import { AuthenticatedHttpProviderModule } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider.module';
import { MockApiProvider } from '@modules/shared/infrastructure/providers/mock-api/mock-api.provider';

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
      provide: 'AuthenticatedMockApiProvider',
      useFactory: (authenticatedHttp: any) => new MockApiProvider(authenticatedHttp),
      inject: ['AuthenticatedHttpProvider'],
    },
    MockApiClientService,
  ],
  exports: [
    AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
    MockApiClientService,
    'AuthenticatedMockApiProvider',
  ],
})
export class AuthInfrastructureServiceModule {}
