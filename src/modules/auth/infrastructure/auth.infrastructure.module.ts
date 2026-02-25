import { Module } from '@nestjs/common';

import { AuthController } from '../auth.controller';

import { AuthInfrastructureServiceModule } from './service/auth.service.module';

@Module({
  imports: [AuthInfrastructureServiceModule],
  controllers: [AuthController],
  exports: [AuthInfrastructureServiceModule],
})
export class AuthInfrastructureModule {}
