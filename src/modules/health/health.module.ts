import { Module } from '@nestjs/common';

import { HealthApplicationModule } from '@modules/health/application/health-application.module';
import { HealthInfrastructureModule } from '@modules/health/infrastructure/health.infrastructure.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    HealthApplicationModule,
    HealthInfrastructureModule,
  ],
  exports: [HealthInfrastructureModule],
})
export class HealthModule {}
