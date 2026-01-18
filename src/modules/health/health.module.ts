import { Module } from '@nestjs/common';

import { HealthApplicationModule } from '@modules/health/application/health-application.module';
import { HealthInfrastructureModule } from '@modules/health/infrastructure/health.infrastructure.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { SharedInfrastructureProviderCacheModule } from '../shared/infrastructure/providers/cache/cache.module';

@Module({
  imports: [
    SharedInfrastructureProviderLogModule,
    SharedInfrastructureProviderCacheModule,
    HealthApplicationModule,
    HealthInfrastructureModule,
  ],
  exports: [HealthInfrastructureModule],
})
export class HealthModule {}
