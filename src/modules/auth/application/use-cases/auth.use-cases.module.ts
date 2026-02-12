import { Module } from '@nestjs/common';

import { AuthLoginSessionUseCase } from '@modules/auth/application/use-cases/auth-login-session.use-case';
import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '@modules/auth/infrastructure/auth.token';

@Module({
  providers: [
    {
      useClass: AuthLoginSessionUseCase,
      provide: AUTH_LOGIN_SESSION_USE_CASE_PROVIDE,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_USE_CASE_PROVIDE],
})
export class AuthApplicationUseCaseModule {}
