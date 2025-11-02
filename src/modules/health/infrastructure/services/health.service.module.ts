import { Module } from '@nestjs/common';

import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.provider';
import { HealthCheckService } from '@modules/health/infrastructure/services/healthCheck.service';

@Module({
  providers: [
    {
      provide: HEALTH_CHECK_SERVICE_PROVIDER,
      useClass: HealthCheckService,
    },
  ],
  exports: [HEALTH_CHECK_SERVICE_PROVIDER],
})
export class HealthInfrastructureServiceModule {}
