import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderCacheModule } from '@app/modules/shared/infrastructure/providers/cache/cache.module';
import { SharedInfrastructureProviderQueueProducerModule } from '@app/modules/shared/infrastructure/providers/queue/producer/producer.module';
import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';

import { HealthController } from './health.controller';

@Module({
  imports: [
    HealthInfrastructureServiceModule,
    SharedInfrastructureProviderCacheModule,
    SharedInfrastructureProviderQueueProducerModule,
  ],
  controllers: [HealthController],
  exports: [HealthInfrastructureServiceModule],
})
export class HealthInfrastructureModule {}
