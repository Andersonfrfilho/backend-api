import { Module } from '@nestjs/common';

import { HealthApplicationModule } from '@modules/health/application/health-application.module';
import { HealthInfrastructureModule } from '@modules/health/infrastructure/health.infrastructure.module';

import { SharedInfrastructureProviderQueueProducerModule } from '../shared/infrastructure/providers/queue/producer/producer.module';

@Module({
  imports: [
    SharedInfrastructureProviderQueueProducerModule,
    HealthApplicationModule,
    HealthInfrastructureModule,
  ],
  exports: [HealthInfrastructureModule],
})
export class HealthModule {}
