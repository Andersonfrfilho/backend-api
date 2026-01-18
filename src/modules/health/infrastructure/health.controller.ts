import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { HealthCheckServiceInterface } from '@modules/health/domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { HealthCheckResponseDto } from '@modules/health/shared/health.dto';
import type { CacheProviderInterface } from '@modules/shared/infrastructure/providers/cache/cache.interface';
import { CACHE_PROVIDER } from '@modules/shared/infrastructure/providers/cache/cache.token';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(HEALTH_CHECK_SERVICE_PROVIDER)
    private readonly healthCheckService: HealthCheckServiceInterface,
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
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
}
