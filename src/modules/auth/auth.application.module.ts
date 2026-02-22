import { Module, forwardRef } from '@nestjs/common';

import { AuthProvider } from './application/auth.provider';
import { AUTH_PROVIDER_TOKEN } from './domain/auth.token';
import { AuthInfrastructureModule } from './infrastructure/auth.infrastructure.module';
import { KeycloakAuthProviderModule } from './infrastructure/providers/keycloak/keycloak.auth.provider.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [
    forwardRef(() => AuthInfrastructureModule),
    KeycloakAuthProviderModule,
    SharedInfrastructureProviderLogModule,
  ],
  providers: [
    {
      provide: 'AuthProvider',
      useClass: AuthProvider,
    },
    {
      provide: AuthProvider,
      useClass: AuthProvider,
    },
  ],
  exports: ['AuthProvider', AuthProvider],
})
export class AuthApplicationModule {}
