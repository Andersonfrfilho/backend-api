import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { AuthHttpInterceptor } from './application/auth.http.interceptor';
import { AuthProvider } from './application/auth.provider';
import { AUTH_PROVIDER_TOKEN } from './domain/auth.token';
import { AuthInfrastructureModule } from './infrastructure/auth.infrastructure.module';
import { KeycloakAuthProviderModule } from './infrastructure/providers/keycloak/keycloak.auth.provider.module';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    AuthInfrastructureModule,
    KeycloakAuthProviderModule,
  ],
  providers: [
    {
      provide: 'AuthProvider',
      useClass: AuthProvider,
    },
    {
      provide: 'AuthHttpInterceptor',
      useFactory: (authProvider: AuthProvider) => new AuthHttpInterceptor(authProvider),
      inject: ['AuthProvider'],
    },
  ],
  exports: ['AuthProvider', 'AuthHttpInterceptor'],
})
export class AuthModule {}
