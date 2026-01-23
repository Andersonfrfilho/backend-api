import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RabbitBindingsService implements OnModuleInit {
  constructor(private readonly amqpConnection: AmqpConnection) {}

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
      } catch (error) {
        // Channel not ready yet
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    throw new Error('RabbitMQ channel not available after retries');
  }

  private async createBindings() {
    const channel = this.amqpConnection.channel;

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
}
