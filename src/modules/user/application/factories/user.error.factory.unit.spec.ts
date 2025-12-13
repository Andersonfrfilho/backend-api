import { faker } from '@faker-js/faker';
import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { UserErrorFactory } from './user.error.factory';

describe('UserErrorFactory (Extended) - Unit Tests', () => {
  describe('invalidUserType', () => {
    it('should create a business logic error', () => {
      const type = 'INVALID_TYPE';
      const error = UserErrorFactory.invalidUserType(type);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });

    it('should handle different user types', () => {
      const testCases = ['ADMIN', 'USER', 'GUEST', 'UNKNOWN'];
      testCases.forEach((type) => {
        const error = UserErrorFactory.invalidUserType(type);
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(422);
      });
    });
  });

  describe('integration tests', () => {
    it('should differentiate between error types', () => {
      const conflictError = UserErrorFactory.duplicateEmail('test@example.com');
      const notFoundError = UserErrorFactory.notFound();
      const validationError = UserErrorFactory.invalidPassword();

      expect(conflictError.statusCode).toBe(409);
      expect(notFoundError.statusCode).toBe(404);
      expect(validationError.statusCode).toBe(422);
    });

    it('should have proper error messages', () => {
      const email = faker.internet.email();
      const error = UserErrorFactory.duplicateEmail(email);
      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);
    });
  });
});
