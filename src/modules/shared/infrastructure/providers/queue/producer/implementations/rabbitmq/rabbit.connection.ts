import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const rabbitConnection = RabbitMQModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    // ✅ EXCHANGES - Declaramos todas as exchanges que vamos usar
    exchanges: [
      // Exchange para notificações (emails, SMS, push notifications)
      {
        name: 'notifications',
        type: 'topic',
        options: {
          durable: true, // Sobrevive restart do broker
          autoDelete: false, // Não apaga automaticamente
        },
      },
      // Exchange para auditoria e logs de segurança
      {
        name: 'audit',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      // Exchange para integrações com sistemas externos
      {
        name: 'integration',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      // Exchange para analytics e processamento assíncrono
      {
        name: 'analytics',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      // Exchange para testes de saúde
      {
        name: 'health',
        type: 'direct',
        options: {
          durable: false,
          autoDelete: true,
        },
      },
      // Exchange padrão para mensagens sem exchange específico
      {
        name: 'default',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      // 🔥 DEAD LETTER EXCHANGES - Para mensagens que falharam
      {
        name: 'notifications.dlx',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      {
        name: 'integration.dlx',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
      {
        name: 'analytics.dlx',
        type: 'topic',
        options: {
          durable: true,
          autoDelete: false,
        },
      },
    ],

    // ✅ QUEUES - Declaramos todas as queues que os consumers vão usar
    queues: [
      // Queue para processamento de emails de notificação
      {
        name: 'email.notifications',
        options: {
          durable: true,
          deadLetterExchange: 'notifications.dlx', // Dead letter exchange
          messageTtl: 86400000, // 24 horas TTL
        },
      },
      // Queue para eventos de auditoria
      {
        name: 'audit.events',
        options: {
          durable: true,
          messageTtl: 604800000, // 7 dias TTL
        },
      },
      // Queue para sincronização com CRM
      {
        name: 'crm.sync',
        options: {
          durable: true,
          deadLetterExchange: 'integration.dlx',
        },
      },
      // Queue para análise de risco/fraude
      {
        name: 'risk.analysis',
        options: {
          durable: true,
          deadLetterExchange: 'analytics.dlx',
        },
      },
      // Queue para testes de saúde
      {
        name: 'health.test.queue',
        options: {
          durable: false,
          autoDelete: true,
        },
      },
      // Queue para mensagens padrão
      {
        name: 'default.queue',
        options: {
          durable: true,
        },
      },
      // 🔥 DEAD LETTER QUEUES - Para mensagens que falharam
      {
        name: 'email.notifications.dlq',

        options: {
          durable: true,
          messageTtl: 2592000000, // 30 dias para análise
        },
      },
      {
        name: 'crm.sync.dlq',
        options: {
          durable: true,
          messageTtl: 2592000000, // 30 dias
        },
      },
      {
        name: 'risk.analysis.dlq',
        options: {
          durable: true,
          messageTtl: 2592000000, // 30 dias
        },
      },
    ],

    // ✅ NOTA: Bindings são criados via RabbitBindingsService no startup
    // Isso é necessário porque o @golevelup/nestjs-rabbitmq não cria bindings
    // automaticamente pela configuração - apenas via decorators @RabbitSubscribe

    // Provide sensible defaults so the app can run outside Docker (e.g. localhost)
    // Env var names: QUEUE_RABBITMQ_USER, QUEUE_RABBITMQ_PASS, QUEUE_RABBITMQ_HOST, QUEUE_RABBITMQ_PORT
    uri: `amqp://${configService.get('QUEUE_RABBITMQ_USER') || 'guest'}:${
      configService.get('QUEUE_RABBITMQ_PASS') || 'guest'
    }@${configService.get('QUEUE_RABBITMQ_HOST') || 'localhost'}:${
      configService.get('QUEUE_RABBITMQ_PORT') || 5672
    }`,
    connectionInitOptions: { wait: false },
  }),
  inject: [ConfigService],
});
