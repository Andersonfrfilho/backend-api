import { Module } from '@nestjs/common';
import { LogModule } from 'src/providers/log/log.module';
import { AUTH_LOGIN_SESSION_USE_CASES_PROVIDE } from './login-session/auth.login-session.use-cases.interface';
import { AuthLoginSessionUseCase } from './login-session/auth.login-session.use-cases';
@Module({
  imports: [LogModule],
  providers: [
    {
      provide: AUTH_LOGIN_SESSION_USE_CASES_PROVIDE,
      useClass: AuthLoginSessionUseCase,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_USE_CASES_PROVIDE],
})
export class AuthUseCasesModule {}
