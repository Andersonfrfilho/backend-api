import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { AppErrorFactory } from '@modules/error/application/app.error.factory';
import { CacheErrorCode } from '@modules/error/domain/error-codes';

import { CacheProviderInterface } from '../../cache.interface';
import { CACHE_REDIS_CONNECTION } from '../../cache.token';

@Injectable()
export class CacheRedisProvider
  implements Omit<CacheProviderInterface, 'setEncrypted' | 'getDecrypted'>
{
  constructor(@Inject(CACHE_REDIS_CONNECTION) private readonly cacheRedisProvider: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.cacheRedisProvider.get(key);
      return data as unknown as T | null;
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error getting cache for key ${key}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.cacheRedisProvider.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await this.cacheRedisProvider.set(key, JSON.stringify(value));
      }
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error setting cache for key ${key}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheRedisProvider.del(key);
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error deleting cache for key ${key}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheRedisProvider.flushdb();
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error clearing cache: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }

  async save<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.set<T>(key, value, ttl);
  }

  async invalidate(key: string): Promise<void> {
    return this.del(key);
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const result = await this.cacheRedisProvider.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = result[0];
        const keys = result[1];

        if (keys.length > 0) {
          await this.cacheRedisProvider.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error invalidating cache by pattern ${pattern}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }
}
