import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { ConfigErrorFactory } from './config.error.factory';

describe('ConfigErrorFactory - Unit Tests', () => {
  describe('invalidConfiguration', () => {
    it('should create a business logic error', () => {
      const error = ConfigErrorFactory.invalidConfiguration();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });

    it('should create error with details', () => {
      const details = 'Database configuration is missing';
      const error = ConfigErrorFactory.invalidConfiguration(details);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
      expect(error.message).toContain('Invalid configuration');
    });

    it('should handle various configuration errors', () => {
      const testCases = [
        'Missing environment variables',
        'Invalid database URL',
        'Invalid API key format',
        undefined,
      ];

      testCases.forEach((detail) => {
        const error = ConfigErrorFactory.invalidConfiguration(detail);
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(422);
      });
    });
  });
});
