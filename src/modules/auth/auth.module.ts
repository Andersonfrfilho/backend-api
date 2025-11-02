import { Module } from '@nestjs/common';

import { AuthController } from '@modules/auth/auth.controller';
import { AuthInfrastructureModule } from '@modules/auth/infrastructure/auth.infrastructure.module';

import { SharedInfrastructureProviderLogModule } from '../shared/infrastructure/providers/log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule, AuthInfrastructureModule],
  controllers: [AuthController],
})
export class AuthModule {}
