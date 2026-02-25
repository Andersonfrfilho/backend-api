import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { AppErrorFactory } from '@modules/error/application/app.error.factory';
import { CacheErrorCode } from '@modules/error/domain/error-codes';

import { CacheProviderInterface } from './cache.interface';
import { CACHE_REDIS_CONNECTION } from './cache.token';

@Injectable()
export class CacheProvider implements CacheProviderInterface {
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
        const ttlInSeconds = Math.floor(ttl);
        await this.cacheRedisProvider.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
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

  async save<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.set<T>(key, value, ttl);
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

  async setEncrypted<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const dataEncrypted = Buffer.from(JSON.stringify(value)).toString('base64');
      if (ttl) {
        const ttlInSeconds = Math.floor(ttl);
        await this.cacheRedisProvider.set(key, dataEncrypted, 'EX', ttlInSeconds);
      } else {
        await this.cacheRedisProvider.set(key, dataEncrypted);
      }
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error setting encrypted cache for key ${key}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }

  async getDecrypted<T>(key: string): Promise<T | null> {
    try {
      const data = await this.cacheRedisProvider.get(key);
      if (data) {
        const dataDecrypted = Buffer.from(data, 'base64').toString('utf-8');
        return JSON.parse(dataDecrypted) as T;
      }
      return null;
    } catch (error) {
      throw AppErrorFactory.businessLogic({
        message: `Error getting decrypted cache for key ${key}: ${error.message}`,
        code: CacheErrorCode.CACHE_OPERATION_FAILED,
      });
    }
  }
}
