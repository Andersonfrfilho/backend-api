import { Module } from '@nestjs/common';

import { SharedInfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [SharedInfrastructureModule],
  exports: [SharedInfrastructureModule],
})
export class SharedModule {}
