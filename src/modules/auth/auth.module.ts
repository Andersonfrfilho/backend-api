import { Module } from '@nestjs/common';

import { AuthInfrastructureModule } from '@modules/auth/infrastructure/auth.infrastructure.module';

import { SharedInfrastructureProviderLogModule } from '../shared/infrastructure/providers/log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule, AuthInfrastructureModule],
})
export class AuthModule {}
