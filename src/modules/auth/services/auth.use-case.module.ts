import { Module } from '@nestjs/common';
import { LogModule } from '@core/providers/log/log.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from './login-session/auth.login-session.interface';
import { AuthLoginSessionService } from './login-session/auth.login-session.service';
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
