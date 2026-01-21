import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

export const rabbitConnection = RabbitMQModule.forRoot({
  exchanges: [
    {
      name: 'exchange1',
      type: 'topic',
    },
  ],
  uri: 'amqp://rabbitmq:rabbitmq@localhost:5672',
  connectionInitOptions: { wait: false },
});
