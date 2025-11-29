import { AuthInfrastructureModule } from '@modules/auth/infrastructure/auth.infrastructure.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SharedInfrastructureProviderLogModule, AuthInfrastructureModule],
})
export class AuthModule {}
