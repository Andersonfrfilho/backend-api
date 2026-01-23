# Message Producer Interface

Esta interface define um contrato profissional para producers de mensagens, seguindo as melhores práticas de empresas como AWS SQS, Apache Kafka, Google Cloud Pub/Sub e RabbitMQ.

## Características Principais

- **QoS (Quality of Service)**: Suporte a diferentes níveis de garantia de entrega
- **Priorização**: Mensagens podem ter diferentes níveis de prioridade
- **Batching**: Envio de mensagens em lote para melhor performance
- **Observabilidade**: Métricas e health checks integrados
- **Resiliência**: Retry automático e dead letter queues
- **Flexibilidade**: Suporte a headers, metadata e configurações customizadas

## Interface Principal

```typescript
interface IMessageProducer<T = any> {
  // Identificação e configuração
  getId(): string;
  getConfig(): ProducerConfig;

  // Health check
  isHealthy(): Promise<ProducerHealth>;

  // Métodos de envio
  send(queueName: string, message: BaseMessage<T>): Promise<SendResult>;
  sendBatch(queueName: string, messages: BaseMessage<T>[]): Promise<BatchSendResult>;
  sendWithConfirmation(queueName: string, message: BaseMessage<T>): Observable<SendResult>;
  sendWithQoS(queueName: string, message: BaseMessage<T>, qos: QoSLevel): Promise<SendResult>;
  sendDelayed(queueName: string, message: BaseMessage<T>, delay: number): Promise<SendResult>;
  sendWithTTL(queueName: string, message: BaseMessage<T>, ttl: number): Promise<SendResult>;

  // Gerenciamento de filas
  getPendingMessages(queueName: string): Promise<number>;
  purgeQueue(queueName: string): Promise<number>;

  // Métricas e observabilidade
  getMetrics(): ProducerMetrics;

  // Lifecycle
  close(): Promise<void>;
  reconnect(): Promise<void>;

  // Eventos
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
}
```

## Exemplo de Uso

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { IMessageProducer, BaseMessage, MessagePriority } from './producer.interface';
import { MESSAGE_PRODUCER_TOKEN } from './producer.token';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(MESSAGE_PRODUCER_TOKEN)
    private readonly producer: IMessageProducer,
  ) {}

  async sendWelcomeEmail(userId: string, email: string) {
    const message: BaseMessage = {
      body: {
        type: 'welcome-email',
        userId,
        email,
        template: 'welcome',
      },
      headers: {
        'content-type': 'application/json',
        'message-type': 'email',
      },
      metadata: {
        correlationId: `welcome-${userId}`,
        userId,
        source: 'auth-service',
      },
      priority: MessagePriority.HIGH,
    };

    const result = await this.producer.send('email-queue', message);

    if (result.success) {
      console.log(`Email sent: ${result.messageId}`);
    }
  }

  async sendBulkNotifications(notifications: Notification[]) {
    const messages = notifications.map((notif) => ({
      body: notif,
      priority: MessagePriority.NORMAL,
      metadata: {
        correlationId: `bulk-${Date.now()}`,
        source: 'bulk-service',
      },
    }));

    const result = await this.producer.sendBatch('notifications', messages, {
      parallel: true,
    });

    console.log(`Sent ${result.successful.length} notifications`);
  }
}
```

## Configuração

```typescript
const producerConfig: ProducerConfig = {
  defaultQoS: QoSLevel.AT_LEAST_ONCE,
  defaultPriority: MessagePriority.NORMAL,
  maxRetries: 3,
  retryDelay: 1000,
  enableDeadLetterQueue: true,
  enableMetrics: true,
  batchSize: 100,
  batchTimeout: 5000,
};
```

## QoS Levels

- **AT_MOST_ONCE**: Fire and forget - sem garantia de entrega
- **AT_LEAST_ONCE**: Garantia de entrega, pode haver duplicatas
- **EXACTLY_ONCE**: Garantia de entrega sem duplicatas (mais custoso)

## Prioridades

- **LOW**: Processamento em background
- **NORMAL**: Processamento padrão
- **HIGH**: Processamento prioritário
- **CRITICAL**: Processamento imediato

## Implementação RabbitMQ

A implementação atual usa RabbitMQ com as seguintes características:

- **Exchanges**: Suporte a tópicos e direct exchanges
- **Dead Letter Queues**: Configuráveis para mensagens não processadas
- **Publisher Confirms**: Confirmação de entrega opcional
- **Message Properties**: Headers, correlation ID, timestamps
- **Connection Management**: Reconexão automática

## Métricas Disponíveis

- Total de mensagens enviadas
- Total de mensagens falhadas
- Total de mensagens em lote
- Latência média
- Tempo de atividade
- Filas utilizadas

## Boas Práticas

1. **Use IDs de Correlação**: Sempre defina `correlationId` para rastreamento
2. **Defina Timeouts**: Use timeouts apropriados para operações críticas
3. **Monitore Health**: Verifique saúde do producer regularmente
4. **Use Batching**: Para alto volume, use `sendBatch` com processamento paralelo
5. **Configure QoS**: Escolha o nível apropriado baseado na criticidade
6. **Defina TTL**: Para dados temporários, use mensagens com TTL
7. **Use Prioridades**: Para mensagens críticas, defina prioridade alta

## Tratamento de Erros

A interface inclui tratamento robusto de erros:

- **Retry automático**: Configurável por producer
- **Dead Letter Queues**: Para mensagens que falham persistentemente
- **Circuit Breaker**: Proteção contra falhas em cascata
- **Logging estruturado**: Para debugging e monitoramento

## Extensibilidade

A interface é projetada para ser extensível:

- **Generic Types**: Suporte a diferentes tipos de payload
- **Event System**: Sistema de eventos para extensões
- **Provider Pattern**: Fácil troca de implementação
- **Configuration**: Configurações flexíveis por ambiente
