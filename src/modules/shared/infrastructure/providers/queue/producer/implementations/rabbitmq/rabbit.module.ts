import { Module } from '@nestjs/common';

import { SharedInfrastructureProviderLogModule } from '../../../../log/log.module';
import { QUEUE_PRODUCER_PROVIDER } from '../../producer.token';

import { RabbitBindingsService } from './rabbit.bindings.service';
import { rabbitConnection } from './rabbit.connection';
import { RabbitMQMessageProducer } from './rabbit.provider';

@Module({
  imports: [rabbitConnection, SharedInfrastructureProviderLogModule],
  providers: [
    {
      provide: QUEUE_PRODUCER_PROVIDER,
      useClass: RabbitMQMessageProducer,
    },
    RabbitBindingsService,
  ],
  exports: [QUEUE_PRODUCER_PROVIDER],
})
export class SharedInfrastructureProviderQueueProducerImplementationsRabbitMqModule {}
