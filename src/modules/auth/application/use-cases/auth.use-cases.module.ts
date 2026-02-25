import { Module } from '@nestjs/common';

import { AuthLoginSessionUseCase } from '@modules/auth/application/use-cases/auth-login-session.use-case';
import { AUTH_LOGIN_SESSION_USE_CASE_PROVIDE } from '@modules/auth/infrastructure/auth.token';
import { SharedInfrastructureContextModule } from '@modules/shared/infrastructure/context/context.module';
import { SharedInfrastructureKeycloakModule } from '@modules/shared/infrastructure/keycloak/keycloak.module';
import { SharedInfrastructureProviderHttpModule } from '@modules/shared/infrastructure/providers/http/http.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [
    SharedInfrastructureProviderHttpModule,
    SharedInfrastructureKeycloakModule,
    SharedInfrastructureContextModule,
    SharedInfrastructureProviderLogModule,
  ],
  providers: [
    {
      useClass: AuthLoginSessionUseCase,
      provide: AUTH_LOGIN_SESSION_USE_CASE_PROVIDE,
    },
  ],
  exports: [AUTH_LOGIN_SESSION_USE_CASE_PROVIDE],
})
export class AuthApplicationUseCaseModule {}
