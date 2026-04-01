import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from '@modules/auth/application/use-cases/auth.use-cases.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.token';
import { AuthenticatedHttpProvider } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider';
import { AuthenticatedHttpProviderModule } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider.module';
import { AUTHENTICATED_HTTP_PROVIDER } from '@modules/auth/infrastructure/providers/authenticated-http/authenticated.http.provider.token';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

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
  ],
  exports: [AUTH_LOGIN_SESSION_SERVICE_PROVIDE],
})
export class AuthInfrastructureServiceModule {}
