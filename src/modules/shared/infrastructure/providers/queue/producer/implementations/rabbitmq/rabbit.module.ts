import { Module } from '@nestjs/common';

import { rabbitConnection } from './rabbit.connection';

@Module({
  imports: [rabbitConnection],
  exports: [],
})
export class SharedInfrastructureProviderQueueProducerImplementationsRabbitMqModule {}
