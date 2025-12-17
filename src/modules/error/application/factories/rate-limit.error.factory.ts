import { BaseErrorFactory } from '@modules/error/application/factories/base.error.factory';
import { RATE_LIMIT_ERROR_CONFIGS } from '@modules/error/domain/configs';

export class RateLimitErrorFactory extends BaseErrorFactory {
  static tooManyRequests(retryAfter: number) {
    return this.createRateLimit(RATE_LIMIT_ERROR_CONFIGS.tooManyRequests(retryAfter));
  }
}
