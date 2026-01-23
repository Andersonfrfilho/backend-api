import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { HealthCheckServiceInterface } from '@modules/health/domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { HealthCheckResponseDto } from '@modules/health/shared/health.dto';
import type { CacheProviderInterface } from '@modules/shared/infrastructure/providers/cache/cache.interface';
import { CACHE_PROVIDER } from '@modules/shared/infrastructure/providers/cache/cache.token';
import type { QueueProducerMessageProviderInterface } from '@modules/shared/infrastructure/providers/queue/producer/producer.interface';
import { QUEUE_PRODUCER_PROVIDER } from '@modules/shared/infrastructure/providers/queue/producer/producer.token';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(HEALTH_CHECK_SERVICE_PROVIDER)
    private readonly healthCheckService: HealthCheckServiceInterface,
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
    @Inject(QUEUE_PRODUCER_PROVIDER)
    private readonly messageProducer: QueueProducerMessageProviderInterface,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica a saúde do serviço',
    description: `
      Esta rota realiza uma verificação de saúde do serviço.
    `,
  })
  @ApiOkResponse({ type: HealthCheckResponseDto })
  check(): HealthCheckResponseDto {
    return this.healthCheckService.execute();
  }

  @Get('cache-test')
  @ApiOperation({
    summary: 'Test Redis cache functionality',
    description: 'Testa as funcionalidades do cache Redis',
  })
  async testCache() {
    console.log('✅ Cache test route called!');
    const testKey = 'test-cache-key';
    const testValue = { message: 'Hello from Redis cache!', timestamp: new Date().toISOString() };

    try {
      // Test set
      await this.cacheProvider.set(testKey, testValue, 60);
      console.log('✅ Set cache OK');

      // Test get
      const retrievedValue = await this.cacheProvider.get(testKey);
      console.log('✅ Get cache OK:', retrievedValue);

      // Test encrypted set/get
      const encryptedKey = 'encrypted-test-key';
      await this.cacheProvider.setEncrypted(encryptedKey, testValue, 60);
      console.log('✅ Set encrypted cache OK');

      const decryptedValue = await this.cacheProvider.getDecrypted(encryptedKey);
      console.log('✅ Get encrypted cache OK:', decryptedValue);

      // Test delete
      await this.cacheProvider.del(testKey);
      await this.cacheProvider.del(encryptedKey);
      console.log('✅ Delete cache OK');

      return {
        success: true,
        message: 'Redis cache test completed successfully',
        results: {
          set: 'OK',
          get: retrievedValue ? 'OK' : 'FAILED',
          encryptedSet: 'OK',
          encryptedGet: decryptedValue ? 'OK' : 'FAILED',
          delete: 'OK',
          data: {
            original: testValue,
            retrieved: retrievedValue,
            decrypted: decryptedValue,
          },
        },
      };
    } catch (error) {
      console.error('❌ Cache test error:', error);
      return {
        success: false,
        message: 'Redis cache test failed',
        error: error.message,
      };
    }
  }

  @Get('queue-test')
  @ApiOperation({
    summary: 'Test message queue functionality',
    description: 'Testa as funcionalidades da fila de mensagens RabbitMQ',
  })
  async testQueue() {
    console.log('✅ Queue test route called!');

    try {
      // Test producer health
      const health = await this.messageProducer.isHealthy();
      console.log('✅ Producer health check OK:', health);

      // Test send simple message
      const testMessage = {
        body: {
          type: 'health-test',
          message: 'Hello from message producer!',
          timestamp: new Date().toISOString(),
          testId: `test-${Date.now()}`,
        },
        headers: {
          'content-type': 'application/json',
          'message-type': 'test',
        },
        metadata: {
          correlationId: `health-test-${Date.now()}`,
          source: 'health-controller',
        },
      };

      const sendResult = await this.messageProducer.send('health.test', testMessage, {
        exchange: 'health',
      });
      console.log('✅ Send message OK:', sendResult);

      // Test send batch
      const batchMessages = [
        {
          body: { type: 'batch-test-1', data: 'First message' },
          metadata: { correlationId: `batch-1-${Date.now()}` },
        },
        {
          body: { type: 'batch-test-2', data: 'Second message' },
          metadata: { correlationId: `batch-2-${Date.now()}` },
        },
      ];

      const batchResult = await this.messageProducer.sendBatch('health.test', batchMessages, {
        exchange: 'health',
      });
      console.log('✅ Send batch OK:', batchResult);

      // Test delayed message
      const delayedMessage = {
        body: {
          type: 'delayed-test',
          message: 'This message will be delayed',
          delaySeconds: 30,
        },
        metadata: { correlationId: `delayed-${Date.now()}` },
      };

      const delayedResult = await this.messageProducer.sendDelayed(
        'health.test',
        delayedMessage,
        30000, // 30 seconds
      );
      console.log('✅ Send delayed message OK:', delayedResult);

      // Test TTL message
      const ttlMessage = {
        body: {
          type: 'ttl-test',
          message: 'This message has TTL',
          expiresIn: '5 minutes',
        },
        metadata: { correlationId: `ttl-${Date.now()}` },
      };

      const ttlResult = await this.messageProducer.sendWithTTL(
        'health.test',
        ttlMessage,
        300000, // 5 minutes
      );
      console.log('✅ Send TTL message OK:', ttlResult);

      // Get metrics
      const metrics = this.messageProducer.getMetrics();
      console.log('✅ Producer metrics OK:', metrics);

      // Test retry strategy - send message that will fail
      const retryTestMessage = {
        body: {
          type: 'retry-test',
          message: 'This message will fail and retry',
          timestamp: new Date().toISOString(),
          testId: `retry-test-${Date.now()}`,
          simulateFailure: true, // Flag para simular falha no consumer
        },
        headers: {
          'content-type': 'application/json',
          'message-type': 'test',
        },
        metadata: {
          correlationId: `retry-test-${Date.now()}`,
          source: 'health-controller',
        },
      };

      const retryResult = await this.messageProducer.send('email.welcome', retryTestMessage, {
        exchange: 'notifications',
      });
      console.log('✅ Retry test message sent:', retryResult);
    } catch (error) {
      console.error('❌ Queue test error:', error);
      return {
        success: false,
        message: 'Message queue test failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
