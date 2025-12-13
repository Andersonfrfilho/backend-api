import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { UserErrorFactory } from './user.error.factory';

describe('UserErrorFactory - Extended Coverage - Unit Tests', () => {
  describe('duplicateEmail', () => {
    it('should create conflict error for duplicate email', () => {
      const email = 'test@example.com';
      const error = UserErrorFactory.duplicateEmail(email);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });

    it('should handle various email formats', () => {
      const emails = [
        'user@domain.com',
        'firstname.lastname@company.co.uk',
        'test+tag@example.com',
      ];
      emails.forEach((email) => {
        const error = UserErrorFactory.duplicateEmail(email);
        expect(error.statusCode).toBe(409);
      });
    });
  });

  describe('duplicateCpf', () => {
    it('should create conflict error for duplicate CPF', () => {
      const cpf = '12345678900';
      const error = UserErrorFactory.duplicateCpf(cpf);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });
  });

  describe('duplicateRg', () => {
    it('should create conflict error for duplicate RG', () => {
      const rg = '123456789';
      const error = UserErrorFactory.duplicateRg(rg);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });
  });

  describe('notFound', () => {
    it('should create not found error without userId', () => {
      const error = UserErrorFactory.notFound();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });

    it('should create not found error with userId', () => {
      const userId = 'user-123';
      const error = UserErrorFactory.notFound(userId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });
  });

  describe('invalidPassword', () => {
    it('should create business logic error for invalid password', () => {
      const error = UserErrorFactory.invalidPassword();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });

  describe('accountDisabled', () => {
    it('should create business logic error for disabled account', () => {
      const userId = 'user-123';
      const error = UserErrorFactory.accountDisabled(userId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });

  describe('emailNotVerified', () => {
    it('should create business logic error for unverified email', () => {
      const email = 'test@example.com';
      const error = UserErrorFactory.emailNotVerified(email);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });

  describe('invalidUserType', () => {
    it('should create business logic error for invalid user type', () => {
      const type = 'INVALID_TYPE';
      const error = UserErrorFactory.invalidUserType(type);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });

    it('should handle different user types', () => {
      const types = ['ADMIN', 'USER', 'GUEST', 'UNKNOWN'];
      types.forEach((type) => {
        const error = UserErrorFactory.invalidUserType(type);
        expect(error.statusCode).toBe(422);
      });
    });
  });

  describe('error inheritance', () => {
    it('all errors should have message property', () => {
      const errors = [
        UserErrorFactory.duplicateEmail('test@example.com'),
        UserErrorFactory.duplicateCpf('12345678900'),
        UserErrorFactory.duplicateRg('123456789'),
        UserErrorFactory.notFound('user-123'),
        UserErrorFactory.invalidPassword(),
        UserErrorFactory.accountDisabled('user-123'),
        UserErrorFactory.emailNotVerified('test@example.com'),
        UserErrorFactory.invalidUserType('GUEST'),
      ];

      errors.forEach((error) => {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      });
    });

    it('all errors should be AppError instances', () => {
      const errors = [
        UserErrorFactory.duplicateEmail('test@example.com'),
        UserErrorFactory.invalidPassword(),
        UserErrorFactory.notFound(),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBeDefined();
      });
    });
  });
});
