import { Module } from '@nestjs/common';

import { HealthController } from '@modules/health/health.controller';
import { HealthInfrastructureModule } from '@modules/health/infrastructure/health.infrastructure.module';
import { SharedInfrastructureProviderLogModule } from '@modules/shared/infrastructure/providers/log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule, HealthInfrastructureModule],
  controllers: [HealthController],
})
export class HealthModule {}
