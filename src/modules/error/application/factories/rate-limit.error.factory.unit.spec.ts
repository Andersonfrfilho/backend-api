import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { RateLimitErrorFactory } from './rate-limit.error.factory';

describe('RateLimitErrorFactory - Unit Tests', () => {
  describe('tooManyRequests', () => {
    it('should create a rate limit error', () => {
      const retryAfter = 60;
      const error = RateLimitErrorFactory.tooManyRequests(retryAfter);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(429);
    });

    it('should include retry after information', () => {
      const retryAfter = 60;
      const error = RateLimitErrorFactory.tooManyRequests(retryAfter);
      expect(error.details).toHaveProperty('retryAfter');
    });

    it('should handle different retry after values', () => {
      const testCases = [30, 60, 120, 300];
      testCases.forEach((retryAfter) => {
        const error = RateLimitErrorFactory.tooManyRequests(retryAfter);
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(429);
      });
    });

    it('should have business logic type', () => {
      const error = RateLimitErrorFactory.tooManyRequests(60);
      expect(error.type).toBe('BUSINESS_LOGIC');
    });
  });
});
