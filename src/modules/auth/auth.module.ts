import { Module } from '@nestjs/common';

import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { AuthController } from './auth.controller';
import { AuthInfrastructureServiceModule } from './infrastructure/service/auth.service.module';

@Module({
  imports: [LogModule, AuthInfrastructureServiceModule],
  controllers: [AuthController],
})
export class AuthModule {}
