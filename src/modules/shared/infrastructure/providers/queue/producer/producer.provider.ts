import { Provider } from '@nestjs/common';

import { RabbitMQMessageProducer } from './implementations/rabbitmq/rabbit.provider';
import { MESSAGE_PRODUCER } from './producer.token';

export const messageProducerProvider: Provider = {
  provide: MESSAGE_PRODUCER,
  useClass: RabbitMQMessageProducer,
};
