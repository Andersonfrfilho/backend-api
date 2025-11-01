import { Module } from '@nestjs/common';

import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '../infrastructure/auth.provider';

import { AuthLoginSessionUseCase } from './use-cases/LoginSessionUseCase';

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
