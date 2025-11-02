import { Module } from '@nestjs/common';

import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';

@Module({
  imports: [HealthInfrastructureServiceModule],
  exports: [HealthInfrastructureServiceModule],
})
export class HealthInfrastructureModule {}
