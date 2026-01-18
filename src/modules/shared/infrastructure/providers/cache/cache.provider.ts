import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

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
      throw new Error(`Error getting cache for key ${key}: ${error.message}`);
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
      throw new Error(`Error setting encrypted cache for key ${key}: ${error.message}`);
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
      throw new Error(`Error getting decrypted cache for key ${key}: ${error.message}`);
    }
  }
}
