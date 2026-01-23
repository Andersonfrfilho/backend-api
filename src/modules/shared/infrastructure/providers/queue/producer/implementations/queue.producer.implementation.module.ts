import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderQueueProducerImplementationsRabbitMqModule } from './rabbitmq/rabbit.module';

@Module({
  imports: [SharedInfrastructureProviderQueueProducerImplementationsRabbitMqModule],
  exports: [SharedInfrastructureProviderQueueProducerImplementationsRabbitMqModule],
})
export class SharedInfrastructureProviderQueueProducerImplementationsModule {}
