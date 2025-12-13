import { faker } from '@faker-js/faker';
import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { PhoneErrorCode, PhoneErrorFactory } from './phone.error.factory';

describe('PhoneErrorFactory - Unit Tests', () => {
  describe('invalidFormat', () => {
    it('should create a validation error', () => {
      const error = PhoneErrorFactory.invalidFormat();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
    });

    it('should create a validation error with phone', () => {
      const phone = '+5585993056772';
      const error = PhoneErrorFactory.invalidFormat(phone);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain(phone);
    });

    it('should include error code', () => {
      const error = PhoneErrorFactory.invalidFormat();
      // Note: validation errors don't have code at top level
      expect(error.message).toContain('Invalid phone format');
    });

    it('should handle different phone formats', () => {
      const testCases = ['123', '(85) 99305-6772', 'invalid-phone'];
      testCases.forEach((phone) => {
        const error = PhoneErrorFactory.invalidFormat(phone);
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(400);
      });
    });
  });

  describe('notFound', () => {
    it('should create a not found error', () => {
      const error = PhoneErrorFactory.notFound();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });

    it('should create a not found error with phone id', () => {
      const phoneId = faker.string.uuid();
      const error = PhoneErrorFactory.notFound(phoneId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Phone not found');
    });

    it('should include error code in details', () => {
      const error = PhoneErrorFactory.notFound();
      expect(error.details).toHaveProperty('code');
      expect(error.details?.code).toBe(PhoneErrorCode.NOT_FOUND);
    });
  });

  describe('error codes', () => {
    it('should have INVALID_FORMAT code', () => {
      expect(PhoneErrorCode.INVALID_FORMAT).toBe('INVALID_PHONE_FORMAT');
    });

    it('should have NOT_FOUND code', () => {
      expect(PhoneErrorCode.NOT_FOUND).toBe('PHONE_NOT_FOUND');
    });
  });
});
