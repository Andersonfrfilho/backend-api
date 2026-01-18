import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderCacheModule } from '@app/modules/shared/infrastructure/providers/cache/cache.module';
import { HealthInfrastructureServiceModule } from '@modules/health/infrastructure/services/health.service.module';

import { HealthController } from './health.controller';

@Module({
  imports: [HealthInfrastructureServiceModule, SharedInfrastructureProviderCacheModule],
  controllers: [HealthController],
  exports: [HealthInfrastructureServiceModule],
})
export class HealthInfrastructureModule {}
