import { Module } from '@nestjs/common';

import { SharedInfrastructureKeycloakModule } from '@modules/shared/infrastructure/keycloak/keycloak.module';
import { SharedInfrastructureProviderJwtModule } from '@modules/shared/infrastructure/providers/jwt/jwt.module';

import { AuthHttpInterceptor } from './application/auth.http.interceptor';
import { AuthProvider } from './application/auth.provider';
import { JwtAuthGuard } from './application/jwt-auth.guard';
import { RolesGuard } from './application/roles.guard';
import { AuthApplicationModule } from './auth.application.module';
import { AUTH_PROVIDER_TOKEN } from './domain/auth.token';
import { AuthInfrastructureModule } from './infrastructure/auth.infrastructure.module';
import { AUTH_HTTP_INTERCEPTOR } from './infrastructure/providers/auth-http/auth-http.interceptor.token';
import { AuthenticatedHttpProvider } from './infrastructure/providers/authenticated-http/authenticated.http.provider';
import { AuthenticatedHttpProviderModule } from './infrastructure/providers/authenticated-http/authenticated.http.provider.module';
import { AUTHENTICATED_HTTP_PROVIDER } from './infrastructure/providers/authenticated-http/authenticated.http.provider.token';

@Module({
  imports: [
    SharedInfrastructureProviderJwtModule,
    SharedInfrastructureKeycloakModule,
    AuthApplicationModule,
    AuthInfrastructureModule,
    AuthenticatedHttpProviderModule,
  ],
  providers: [
    {
      provide: AUTH_HTTP_INTERCEPTOR,
      useFactory: (authProvider: AuthProvider) => new AuthHttpInterceptor(authProvider),
      inject: [AUTH_PROVIDER_TOKEN],
    },
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AUTH_HTTP_INTERCEPTOR, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
