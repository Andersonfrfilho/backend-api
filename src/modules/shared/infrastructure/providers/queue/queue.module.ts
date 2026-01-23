import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderQueueProducerModule } from './producer/producer.module';

@Module({
  imports: [SharedInfrastructureProviderQueueProducerModule],
  exports: [SharedInfrastructureProviderQueueProducerModule],
})
export class SharedInfrastructureProviderQueueModule {}
