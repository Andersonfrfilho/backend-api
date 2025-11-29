import { Module } from '@nestjs/common';

import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';

import { HealthController } from './health.controller';

@Module({
  imports: [HealthInfrastructureServiceModule],
  controllers: [HealthController],
  exports: [HealthInfrastructureServiceModule],
})
export class HealthInfrastructureModule {}
