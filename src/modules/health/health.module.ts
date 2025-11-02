import { Module } from '@nestjs/common';

import { HealthController } from '@modules/health/health.controller';
import { LogModule } from '@modules/shared/infrastructure/providers/log/log.module';

import { HealthInfrastructureModule } from './infrastructure/health.infrastructure.module';

@Module({
  imports: [LogModule, HealthInfrastructureModule],
  controllers: [HealthController],
})
export class HealthModule {}
