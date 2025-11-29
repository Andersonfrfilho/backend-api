import { Module } from '@nestjs/common';

import { HealthInfrastructureModule } from '@modules/health/infrastructure/health.infrastructure.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule, HealthInfrastructureModule],
  exports: [HealthInfrastructureModule],
})
export class HealthModule {}
