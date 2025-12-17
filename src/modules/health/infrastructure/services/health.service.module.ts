import { Module } from '@nestjs/common';

import { HealthApplicationUseCasesModule } from '@modules/health/application/use-cases/health-use-cases.module';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { HealthCheckService } from '@modules/health/infrastructure/services/health.check.service';

@Module({
  imports: [HealthApplicationUseCasesModule],
  providers: [
    {
      provide: HEALTH_CHECK_SERVICE_PROVIDER,
      useClass: HealthCheckService,
    },
  ],
  exports: [HEALTH_CHECK_SERVICE_PROVIDER],
})
export class HealthInfrastructureServiceModule {}
