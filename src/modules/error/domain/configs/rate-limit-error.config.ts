import type { RateLimitErrorConfig } from '@modules/error/domain/configs/error-config.interface';
import { RateLimitErrorCode } from '@modules/error/domain/error-codes';

export const RATE_LIMIT_ERROR_CONFIGS = {
  tooManyRequests: (retryAfter: number): RateLimitErrorConfig => ({
    message: `Too many requests. Try again in ${retryAfter} seconds.`,
    code: RateLimitErrorCode.TOO_MANY_REQUESTS,
    details: { retryAfter },
  }),
} as const;
