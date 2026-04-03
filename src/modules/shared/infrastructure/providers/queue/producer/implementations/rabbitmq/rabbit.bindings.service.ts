import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { AppErrorFactory } from '@modules/error/application/app.error.factory';
import { MethodNotImplementedErrorCode } from '@modules/error/domain/error-codes';

@Injectable()
export class RabbitBindingsService implements OnModuleInit {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private readonly exchanges = [
    { name: 'notifications', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'audit', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'integration', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'analytics', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'health', type: 'direct', options: { durable: false, autoDelete: true } },
    { name: 'default', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'notifications.dlx', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'integration.dlx', type: 'topic', options: { durable: true, autoDelete: false } },
    { name: 'analytics.dlx', type: 'topic', options: { durable: true, autoDelete: false } },
  ] as const;

  private readonly queues = [
    {
      name: 'email.notifications',
      options: { durable: true, deadLetterExchange: 'notifications.dlx', messageTtl: 86400000 },
    },
    {
      name: 'audit.events',
      options: { durable: true, messageTtl: 604800000 },
    },
    {
      name: 'crm.sync',
      options: { durable: true, deadLetterExchange: 'integration.dlx' },
    },
    {
      name: 'risk.analysis',
      options: { durable: true, deadLetterExchange: 'analytics.dlx' },
    },
    {
      name: 'health.test.queue',
      options: { durable: false, autoDelete: true },
    },
    {
      name: 'default.queue',
      options: { durable: true },
    },
    {
      name: 'email.notifications.dlq',
      options: { durable: true, messageTtl: 2592000000 },
    },
    {
      name: 'crm.sync.dlq',
      options: { durable: true, messageTtl: 2592000000 },
    },
    {
      name: 'risk.analysis.dlq',
      options: { durable: true, messageTtl: 2592000000 },
    },
  ] as const;

  async onModuleInit() {
    try {
      await this.waitForChannel();
      await this.createBindings();
      console.log('✅ RabbitMQ bindings created successfully');
    } catch (error) {
      console.error('❌ Error creating RabbitMQ bindings:', error);
    }
  }

  private async waitForChannel(maxRetries = 10, delayMs = 100): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const channel = this.amqpConnection.channel;
        if (channel) {
          console.log('🔗 RabbitMQ channel available, creating bindings...');
          return;
        }
      } catch {
        // Channel not ready yet
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    throw AppErrorFactory.businessLogic({
      message: 'RabbitMQ channel not available after retries',
      code: MethodNotImplementedErrorCode.METHOD_NOT_IMPLEMENTED,
    });
  }

  private async createBindings() {
    const channel = this.amqpConnection.channel;

    await this.assertInfrastructure(channel);

    // Notifications exchange → email queue
    await channel.bindQueue('email.notifications', 'notifications', 'email.welcome');
    await channel.bindQueue('email.notifications', 'notifications', 'email.*');

    // Audit exchange → audit queue
    await channel.bindQueue('audit.events', 'audit', 'audit.user.created');
    await channel.bindQueue('audit.events', 'audit', 'audit.*');

    // Integration exchange → CRM queue
    await channel.bindQueue('crm.sync', 'integration', 'integration.crm.sync');
    await channel.bindQueue('crm.sync', 'integration', 'integration.*');

    // Analytics exchange → risk analysis queue
    await channel.bindQueue('risk.analysis', 'analytics', 'analytics.risk.analysis');
    await channel.bindQueue('risk.analysis', 'analytics', 'analytics.*');

    // Health exchange → health test queue
    await channel.bindQueue('health.test.queue', 'health', 'health.test');

    // Default exchange → default queue
    await channel.bindQueue('default.queue', 'default', '#');

    // Dead letter bindings
    await channel.bindQueue('email.notifications.dlq', 'notifications.dlx', '#');
    await channel.bindQueue('crm.sync.dlq', 'integration.dlx', '#');
    await channel.bindQueue('risk.analysis.dlq', 'analytics.dlx', '#');
  }

  private async assertInfrastructure(channel: AmqpConnection['channel']) {
    for (const exchange of this.exchanges) {
      await channel.assertExchange(exchange.name, exchange.type, exchange.options);
    }

    for (const queue of this.queues) {
      await channel.assertQueue(queue.name, queue.options);
    }
  }
}
