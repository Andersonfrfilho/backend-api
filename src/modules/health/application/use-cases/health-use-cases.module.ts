import { Module } from '@nestjs/common';

import { HealthCheckUseCase } from '@modules/health/application/use-cases/health.get.use-case';
import { HEALTH_CHECK_USE_CASE_PROVIDER } from '@modules/health/infrastructure/health.token';

@Module({
  providers: [
    {
      provide: HEALTH_CHECK_USE_CASE_PROVIDER,
      useClass: HealthCheckUseCase,
    },
  ],
  exports: [HEALTH_CHECK_USE_CASE_PROVIDER],
})
export class HealthApplicationUseCasesModule {}
