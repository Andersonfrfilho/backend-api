import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderLogModule } from './log/log.module';

@Module({
  imports: [SharedInfrastructureProviderLogModule],
  exports: [SharedInfrastructureProviderLogModule],
})
export class SharedInfrastructureProviderModule {}
