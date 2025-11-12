import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from '@modules/auth/application/use-cases/auth.use-cases.module';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '../auth.token';

@Module({
  imports: [SharedInfrastructureProviderLogModule, AuthApplicationUseCaseModule],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      useClass: AuthLoginSessionService,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_SERVICE_PROVIDE],
})
export class AuthInfrastructureServiceModule {}
