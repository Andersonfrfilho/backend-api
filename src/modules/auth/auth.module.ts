import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderJwtModule } from '@modules/shared/infrastructure/providers/jwt/jwt.module';
import { MockApiProvider } from '@modules/shared/infrastructure/providers/mock-api/mock-api.provider';

import { AuthHttpInterceptor } from './application/auth.http.interceptor';
import { AuthProvider } from './application/auth.provider';
import { JwtAuthGuard } from './application/jwt-auth.guard';
import { MockApiClientService } from './application/mock-api-client.service';
import { RolesGuard } from './application/roles.guard';
import { AuthApplicationModule } from './auth.application.module';
import { AuthInfrastructureModule } from './infrastructure/auth.infrastructure.module';
import { AuthenticatedHttpProvider } from './infrastructure/providers/authenticated-http/authenticated.http.provider';
import { AuthenticatedHttpProviderModule } from './infrastructure/providers/authenticated-http/authenticated.http.provider.module';
import { SharedInfrastructureKeycloakModule } from '@modules/shared/infrastructure/keycloak/keycloak.module';

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
      provide: 'AuthHttpInterceptor',
      useFactory: (authProvider: AuthProvider) => new AuthHttpInterceptor(authProvider),
      inject: ['AuthProvider'],
    },
    {
      provide: 'AuthenticatedMockApiProvider',
      useFactory: (authenticatedHttp: AuthenticatedHttpProvider) =>
        new MockApiProvider(authenticatedHttp),
      inject: ['AuthenticatedHttpProvider'],
    },
    JwtAuthGuard,
    RolesGuard,
    MockApiClientService,
  ],
  exports: ['AuthHttpInterceptor', JwtAuthGuard, RolesGuard, MockApiClientService],
})
export class AuthModule {}
