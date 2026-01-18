import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const createRedisConnection = async (configService: ConfigService) => {
  const redis = new Redis({
    host: configService.get('CACHE_REDIS_HOST', 'localhost'),
    port: configService.get('CACHE_REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD'), // Opcional, para auth
  });

  redis.on('error', (err) => console.error('Redis Client Error', err));
  await redis.ping();

  return redis;
};
