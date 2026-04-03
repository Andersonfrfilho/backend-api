import type { CacheProviderInterface } from '@adatechnology/cache';
import { CACHE_PROVIDER } from '@adatechnology/cache';
import { LOGGER_PROVIDER, type LoggerProviderInterface } from '@adatechnology/logger';
import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { HealthCheckServiceInterface } from '@modules/health/domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { HealthCheckResponseDto } from '@modules/health/shared/health.dto';
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
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerProviderInterface,
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
    const logContext = { className: HealthController.name, methodName: this.testCache.name };

    this.logger.info({
      message: 'Cache test route called',
      context: HealthController.name,
      meta: { logContext },
    });

    const testKey = 'test-cache-key';
    const testValue = { message: 'Hello from Redis cache!', timestamp: new Date().toISOString() };

    try {
      await this.cacheProvider.set(testKey, testValue, 60);
      this.logger.info({
        message: 'Set cache OK',
        context: HealthController.name,
        meta: { logContext },
      });

      const retrievedValue = await this.cacheProvider.get(testKey);
      this.logger.info({
        message: 'Get cache OK',
        context: HealthController.name,
        meta: { retrievedValue, logContext },
      });

      const encryptedKey = 'encrypted-test-key';
      const encode = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64');
      const decode = (s: string) => JSON.parse(Buffer.from(s, 'base64').toString('utf-8'));

      await this.cacheProvider.set(encryptedKey, encode(testValue), 60);
      this.logger.info({
        message: 'Set encrypted cache OK',
        context: HealthController.name,
        meta: { logContext },
      });

      const encryptedRaw = await this.cacheProvider.get<string>(encryptedKey);
      const decryptedValue = encryptedRaw ? decode(encryptedRaw) : null;
      this.logger.info({
        message: 'Get encrypted cache OK',
        context: HealthController.name,
        meta: { decryptedValue, logContext },
      });

      await this.cacheProvider.del(testKey);
      await this.cacheProvider.del(encryptedKey);
      this.logger.info({
        message: 'Delete cache OK',
        context: HealthController.name,
        meta: { logContext },
      });

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
      this.logger.error({
        message: 'Cache test error',
        context: HealthController.name,
        meta: { error: error.message, logContext },
      });
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
    const logContext = { className: HealthController.name, methodName: this.testQueue.name };

    this.logger.info({
      message: 'Queue test route called',
      context: HealthController.name,
      meta: { logContext },
    });

    try {
      const health = await this.messageProducer.isHealthy();
      this.logger.info({
        message: 'Producer health check OK',
        context: HealthController.name,
        meta: { health, logContext },
      });

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
      this.logger.info({
        message: 'Send message OK',
        context: HealthController.name,
        meta: { sendResult, logContext },
      });

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
      this.logger.info({
        message: 'Send batch OK',
        context: HealthController.name,
        meta: { batchResult, logContext },
      });

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
        30000,
      );
      this.logger.info({
        message: 'Send delayed message OK',
        context: HealthController.name,
        meta: { delayedResult, logContext },
      });

      const ttlMessage = {
        body: {
          type: 'ttl-test',
          message: 'This message has TTL',
          expiresIn: '5 minutes',
        },
        metadata: { correlationId: `ttl-${Date.now()}` },
      };

      const ttlResult = await this.messageProducer.sendWithTTL('health.test', ttlMessage, 300000);
      this.logger.info({
        message: 'Send TTL message OK',
        context: HealthController.name,
        meta: { ttlResult, logContext },
      });

      const metrics = this.messageProducer.getMetrics();
      this.logger.info({
        message: 'Producer metrics OK',
        context: HealthController.name,
        meta: { metrics, logContext },
      });

      const retryTestMessage = {
        body: {
          type: 'retry-test',
          message: 'This message will fail and retry',
          timestamp: new Date().toISOString(),
          testId: `retry-test-${Date.now()}`,
          simulateFailure: true,
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
      this.logger.info({
        message: 'Retry test message sent',
        context: HealthController.name,
        meta: { retryResult, logContext },
      });
    } catch (error) {
      this.logger.error({
        message: 'Queue test error',
        context: HealthController.name,
        meta: { error: error.message, stack: error.stack, logContext },
      });
      return {
        success: false,
        message: 'Message queue test failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
