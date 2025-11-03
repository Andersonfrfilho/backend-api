import { Module } from '@nestjs/common';

import { AuthInfrastructureServiceModule } from './service/auth.service.module';

@Module({
  imports: [AuthInfrastructureServiceModule],
  exports: [AuthInfrastructureServiceModule],
})
export class AuthInfrastructureModule {}
