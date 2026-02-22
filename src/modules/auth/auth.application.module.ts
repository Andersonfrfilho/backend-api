import { Module, forwardRef } from '@nestjs/common';

import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { AuthProvider } from './application/auth.provider';
import { AuthInfrastructureModule } from './infrastructure/auth.infrastructure.module';
import { KeycloakAuthProviderModule } from './infrastructure/providers/keycloak/keycloak.auth.provider.module';

@Module({
  imports: [
    forwardRef(() => AuthInfrastructureModule),
    KeycloakAuthProviderModule,
    SharedInfrastructureProviderLogModule,
  ],
  providers: [AuthProvider],
  exports: [AuthProvider, KeycloakAuthProviderModule],
})
export class AuthApplicationModule {}
