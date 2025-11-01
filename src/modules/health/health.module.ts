import { Module } from '@nestjs/common';

import { HealthController } from '@modules/health/health.controller';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/health.interfaces';
import { HealthCheckService } from '@modules/health/services/healthCheck.service';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [LogModule],
  controllers: [HealthController],
  providers: [
    {
      useClass: HealthCheckService,
      provide: HEALTH_CHECK_SERVICE_PROVIDER,
    },
  ],
  exports: [HEALTH_CHECK_SERVICE_PROVIDER],
})
export class HealthModule {}
