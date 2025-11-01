import { Module } from '@nestjs/common';

import { AuthController } from '@modules/auth/auth.controller';
import { AuthInfrastructureServiceModule } from '@modules/auth/infrastructure/service/auth.service.module';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule, AuthInfrastructureServiceModule],
  controllers: [AuthController],
})
export class AuthModule {}
