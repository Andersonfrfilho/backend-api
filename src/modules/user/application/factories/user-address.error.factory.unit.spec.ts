import { faker } from '@faker-js/faker';
import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { UserAddressErrorCode, UserAddressErrorFactory } from './user-address.error.factory';

describe('UserAddressErrorFactory - Unit Tests', () => {
  describe('notFound', () => {
    it('should create a not found error', () => {
      const error = UserAddressErrorFactory.notFound();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });

    it('should create a not found error with user address id', () => {
      const userAddressId = faker.string.uuid();
      const error = UserAddressErrorFactory.notFound(userAddressId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('User address not found');
    });

    it('should include error code in details', () => {
      const error = UserAddressErrorFactory.notFound();
      expect(error.details).toHaveProperty('code');
      expect(error.details?.code).toBe(UserAddressErrorCode.NOT_FOUND);
    });
  });

  describe('invalidCombination', () => {
    it('should create a validation error', () => {
      const error = UserAddressErrorFactory.invalidCombination();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
    });

    it('should create a validation error with user id and address id', () => {
      const userId = faker.string.uuid();
      const addressId = faker.string.uuid();
      const error = UserAddressErrorFactory.invalidCombination(userId, addressId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('Invalid user and address combination');
    });
  });

  describe('error codes', () => {
    it('should have NOT_FOUND code', () => {
      expect(UserAddressErrorCode.NOT_FOUND).toBe('USER_ADDRESS_NOT_FOUND');
    });

    it('should have INVALID_COMBINATION code', () => {
      expect(UserAddressErrorCode.INVALID_COMBINATION).toBe('INVALID_USER_ADDRESS_COMBINATION');
    });
  });
});
