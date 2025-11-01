import { Module } from '@nestjs/common';

import { LogModule } from '@app/modules/shared/infrastructure/providers/log/log.module';

import { AuthApplicationUseCaseModule } from '../../application/auth.use-cases.module';
import { AUTH_LOGIN_SESSION_SERVICE_PROVIDE } from '../auth.provider';

import { AuthLoginSessionService } from './auth.login-session.service';

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
