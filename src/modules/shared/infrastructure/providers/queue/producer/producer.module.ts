import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderQueueProducerImplementationsModule } from './implementations/queue.producer.implementation.module';

@Module({
  imports: [SharedInfrastructureProviderQueueProducerImplementationsModule],
  exports: [SharedInfrastructureProviderQueueProducerImplementationsModule],
})
export class SharedInfrastructureProviderQueueProducerModule {}
