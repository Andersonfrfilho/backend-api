import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderLogModule } from '@app/modules/shared/infrastructure/providers/log/log.module';
import { AuthApplicationModule } from '@modules/auth/application/auth.application.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '@modules/auth/infrastructure/auth.provider';
import { AuthLoginSessionService } from '@modules/auth/infrastructure/service/auth.login-session.service';

@Module({
  imports: [SharedInfrastructureProviderLogModule, AuthApplicationModule],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_SERVICE_PROVIDE,
      useClass: AuthLoginSessionService,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_SERVICE_PROVIDE],
})
export class AuthInfrastructureServiceModule {}
