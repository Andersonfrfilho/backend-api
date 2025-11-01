import { Module } from '@nestjs/common';

import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/services/login-session/auth.login-session.interface';
import { AuthLoginSessionService } from '@modules/auth/services/login-session/auth.login-session.service';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      useClass: AuthLoginSessionService,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_SERVICE_PROVIDE],
})
export class AuthServicesModule {}
