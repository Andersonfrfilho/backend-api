import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

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
      throw new Error(`Error getting cache for key ${key}: ${error.message}`);
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
      throw new Error(`Error setting cache for key ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheRedisProvider.del(key);
    } catch (error) {
      throw new Error(`Error deleting cache for key ${key}: ${error.message}`);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheRedisProvider.flushdb();
    } catch (error) {
      throw new Error(`Error clearing cache: ${error.message}`);
    }
  }
}
