import { Module } from '@nestjs/common';

import { AuthApplicationUseCaseModule } from '@modules/auth/application/auth.use-cases.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule, AuthApplicationUseCaseModule],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      useClass: AuthLoginSessionService,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_SERVICE_PROVIDE],
})
export class AuthInfrastructureServiceModule {}
