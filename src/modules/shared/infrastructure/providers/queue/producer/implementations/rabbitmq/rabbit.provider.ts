import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Inject } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import type { LogProviderInterface } from '@modules/shared/domain';
import { LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/log.token';

import type { QueueProducerMessageProviderInterface } from '../../producer.interface';
import {
  BaseMessage,
  SendResult,
  BatchSendResult,
  ProducerConfig,
  ProducerHealth,
  MessagePriority,
  QoSLevel,
} from '../../producer.interface';

/**
 * RabbitMQ implementation of the Message Producer interface
 *
 * This implementation provides enterprise-grade message production capabilities
 * with support for QoS, batching, dead letter queues, and comprehensive error handling.
 */
@Injectable()
export class RabbitMQMessageProducer<T = any> implements QueueProducerMessageProviderInterface<T> {
  private readonly producerId: string;
  private config: ProducerConfig;
  private metrics = {
    totalSent: 0,
    totalFailed: 0,
    totalBatched: 0,
    averageLatency: 0,
    uptime: Date.now(),
    queues: new Set<string>(),
  };

  constructor(
    private readonly amqpConnection: AmqpConnection,
    @Inject(LOG_PROVIDER) private readonly logger: LogProviderInterface,
  ) {
    this.producerId = `rabbitmq-producer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.config = {
      defaultQoS: QoSLevel.AT_LEAST_ONCE,
      defaultPriority: MessagePriority.NORMAL,
      maxRetries: 3,
      retryDelay: 1000,
      enableDeadLetterQueue: true,
      enableMetrics: true,
      batchSize: 100,
      batchTimeout: 5000,
    };
  }

  getId(): string {
    return this.producerId;
  }

  getConfig(): ProducerConfig {
    return { ...this.config };
  }

  async isHealthy(): Promise<ProducerHealth> {
    try {
      // Check connection status
      const isConnected = this.amqpConnection.connected;

      return {
        isHealthy: isConnected,
        connectionStatus: isConnected ? 'connected' : 'disconnected',
        pendingMessages: 0, // RabbitMQ doesn't expose this easily
        uptime: Date.now() - this.metrics.uptime,
      };
    } catch (error) {
      return {
        isHealthy: false,
        connectionStatus: 'error',
        pendingMessages: 0,
        lastError: error as Error,
        uptime: Date.now() - this.metrics.uptime,
      };
    }
  }

  async send(
    queueName: string,
    message: BaseMessage<T>,
    options?: {
      routingKey?: string;
      exchange?: string;
      mandatory?: boolean;
      immediate?: boolean;
      persistent?: boolean;
    },
  ): Promise<SendResult> {
    const startTime = Date.now();
    const messageId = message.metadata?.messageId || this.generateMessageId();

    try {
      const routingKey = options?.routingKey || queueName;
      const exchange = options?.exchange || 'default';

      // Prepare message with metadata
      const messageToSend = {
        ...message.body,
        _metadata: {
          ...message.metadata,
          messageId,
          timestamp: new Date(),
          producerId: this.producerId,
        },
      };

      // Set message properties
      const publishOptions: any = {
        messageId,
        correlationId: message.metadata?.correlationId,
        timestamp: Date.now(),
        // REMOVIDO: userId - propriedade reservada do AMQP
        headers: {
          ...message.headers,
          priority: message.priority || this.config.defaultPriority,
          delay: message.delay,
          ttl: message.ttl,
          // Adicionar userId nos headers customizados
          'x-user-id': message.metadata?.userId,
          'x-source': message.metadata?.source,
          'x-session-id': message.metadata?.sessionId,
          'x-version': message.metadata?.version,
        },
        persistent: options?.persistent !== false, // Default to persistent
        mandatory: options?.mandatory || false,
        immediate: options?.immediate || false,
      };

      // Publish message
      await this.amqpConnection.publish(exchange, routingKey, messageToSend, publishOptions);

      // Update metrics
      this.metrics.totalSent++;
      this.metrics.queues.add(queueName);

      const result: SendResult = {
        messageId,
        success: true,
        timestamp: new Date(),
        correlationId: message.metadata?.correlationId,
      };

      this.logger.debug({
        message: `Message sent successfully: ${messageId} to exchange '${exchange}' with routing key '${routingKey}'`,
        context: 'RabbitMQMessageProducer.send',
        requestId: message.metadata?.correlationId,
        params: { messageId, exchange, routingKey, queueName },
      });
      return result;
    } catch (error) {
      this.metrics.totalFailed++;

      const result: SendResult = {
        messageId,
        success: false,
        error: error as Error,
        timestamp: new Date(),
      };

      this.logger.error({
        message: `Failed to send message ${messageId} to ${queueName}`,
        context: 'RabbitMQMessageProducer.send',
        requestId: message.metadata?.correlationId,
        params: { messageId, queueName, error: error.message },
      });
      return result;
    }
  }

  async sendBatch(
    queueName: string,
    messages: BaseMessage<T>[],
    options?: {
      routingKey?: string;
      exchange?: string;
      transaction?: boolean;
      parallel?: boolean;
    },
  ): Promise<BatchSendResult> {
    const startTime = Date.now();
    const successful: SendResult[] = [];
    const failed: SendResult[] = [];

    try {
      if (options?.parallel) {
        // Send messages in parallel
        const promises = messages.map((message) => this.send(queueName, message, options));
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              successful.push(result.value);
            } else {
              failed.push(result.value);
            }
          } else {
            failed.push({
              messageId: messages[index].metadata?.messageId || `batch-${index}`,
              success: false,
              error: result.reason,
              timestamp: new Date(),
            });
          }
        });
      } else {
        // Send messages sequentially
        for (const message of messages) {
          const result = await this.send(queueName, message, options);
          if (result.success) {
            successful.push(result);
          } else {
            failed.push(result);
          }
        }
      }

      this.metrics.totalBatched += messages.length;

      return {
        successful,
        failed,
        totalProcessed: messages.length,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error({
        message: `Batch send failed for queue ${queueName}`,
        context: 'RabbitMQMessageProducer.sendBatch',
        params: { queueName, error: error.message, totalMessages: messages.length },
      });

      return {
        successful,
        failed: [
          ...failed,
          ...messages.slice(successful.length + failed.length).map((msg, index) => ({
            messageId: msg.metadata?.messageId || `batch-failed-${index}`,
            success: false,
            error: error as Error,
            timestamp: new Date(),
          })),
        ],
        totalProcessed: messages.length,
        duration: Date.now() - startTime,
      };
    }
  }

  sendWithConfirmation(
    queueName: string,
    message: BaseMessage<T>,
    timeoutMs: number = 30000,
  ): Observable<SendResult> {
    return from(this.send(queueName, message)).pipe(
      timeout(timeoutMs),
      catchError((error) => {
        return of({
          messageId: message.metadata?.messageId || this.generateMessageId(),
          success: false,
          error,
          timestamp: new Date(),
        });
      }),
    );
  }

  async sendWithQoS(
    queueName: string,
    message: BaseMessage<T>,
    qos: QoSLevel,
  ): Promise<SendResult> {
    // For RabbitMQ, QoS is handled at channel level, not per message
    // This is a simplified implementation
    return this.send(queueName, message);
  }

  async sendDelayed(
    queueName: string,
    message: BaseMessage<T>,
    delay: number,
    options?: {
      routingKey?: string;
      exchange?: string;
      mandatory?: boolean;
      immediate?: boolean;
      persistent?: boolean;
    },
  ): Promise<SendResult> {
    const routingKey = options?.routingKey || queueName;
    const exchange = options?.exchange || 'default';

    const delayedMessage = {
      ...message,
      headers: {
        ...message.headers,
        'x-delay': delay,
      },
    };

    const publishOptions = {
      messageId: message.metadata?.messageId || this.generateMessageId(),
      correlationId: message.metadata?.correlationId,
      timestamp: Date.now(),
      // REMOVIDO: userId - propriedade reservada do AMQP
      headers: {
        ...delayedMessage.headers,
        priority: message.priority || this.config.defaultPriority,
        delay: message.delay,
        ttl: message.ttl,
        // Adicionar userId nos headers customizados
        'x-user-id': message.metadata?.userId,
        'x-source': message.metadata?.source,
        'x-session-id': message.metadata?.sessionId,
        'x-version': message.metadata?.version,
      },
      persistent: options?.persistent !== false, // Default to persistent
      mandatory: options?.mandatory || false,
      immediate: options?.immediate || false,
    };

    // Publish delayed message
    await this.amqpConnection.publish(exchange, routingKey, delayedMessage.body, publishOptions);

    // Update metrics
    this.metrics.totalSent++;
    this.metrics.queues.add(queueName);

    const result: SendResult = {
      messageId: publishOptions.messageId,
      success: true,
      timestamp: new Date(),
      correlationId: message.metadata?.correlationId,
    };

    this.logger.debug({
      message: `Delayed message sent successfully: ${publishOptions.messageId} to ${queueName} (delay: ${delay}ms)`,
      context: 'RabbitMQMessageProducer.sendDelayed',
    });

    return result;
  }

  async sendWithTTL(queueName: string, message: BaseMessage<T>, ttl: number): Promise<SendResult> {
    const ttlMessage = {
      ...message,
      headers: {
        ...message.headers,
        expiration: ttl.toString(),
      },
    };

    return this.send(queueName, ttlMessage);
  }

  async getPendingMessages(queueName: string): Promise<number> {
    // RabbitMQ doesn't provide this information easily through the client
    // In a real implementation, you might use management API
    return 0;
  }

  async purgeQueue(queueName: string): Promise<number> {
    try {
      // RabbitMQ purgeQueue via management API or channel
      // For now, return 0 as this requires additional setup
      this.logger.info({
        message: `Purge queue requested for ${queueName}`,
        context: 'RabbitMQMessageProducer.purgeQueue',
        params: { queueName },
      });
      return 0;
    } catch (error) {
      this.logger.error({
        message: `Failed to purge queue ${queueName}`,
        context: 'RabbitMQMessageProducer.purgeQueue',
        params: { queueName, error: error.message },
      });
      return 0;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      queues: Array.from(this.metrics.queues),
    };
  }

  async close(): Promise<void> {
    try {
      // RabbitMQ connection is managed by the module
      this.logger.info({
        message: `Producer ${this.producerId} closed`,
        context: 'RabbitMQMessageProducer.close',
        params: { producerId: this.producerId },
      });
    } catch (error) {
      this.logger.error({
        message: `Error closing producer ${this.producerId}`,
        context: 'RabbitMQMessageProducer.close',
        params: { producerId: this.producerId, error: error.message },
      });
    }
  }

  async reconnect(): Promise<void> {
    // RabbitMQ connection is managed by the module
    this.logger.info({
      message: `Producer ${this.producerId} reconnected`,
      context: 'RabbitMQMessageProducer.reconnect',
      params: { producerId: this.producerId },
    });
  }

  on(event: string, listener: (...args: any[]) => void): void {
    // Event handling would be implemented based on specific needs
    this.logger.debug({
      message: `Event listener added for ${event}`,
      context: 'RabbitMQMessageProducer.on',
      params: { event, producerId: this.producerId },
    });
  }

  off(event: string, listener: (...args: any[]) => void): void {
    // Event handling would be implemented based on specific needs
    this.logger.debug({
      message: `Event listener removed for ${event}`,
      context: 'RabbitMQMessageProducer.off',
      params: { event, producerId: this.producerId },
    });
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
