import { faker } from '@faker-js/faker';
import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { UserErrorFactory } from './user.error.factory';

describe('UserErrorFactory - Unit Tests', () => {
  describe('duplicateEmail', () => {
    it('should create a conflict error', () => {
      const email = faker.internet.email();
      const error = UserErrorFactory.duplicateEmail(email);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });

    it('should have email in details', () => {
      const email = faker.internet.email();
      const error = UserErrorFactory.duplicateEmail(email);
      expect(error.details).toHaveProperty('email');
    });
  });

  describe('duplicateCpf', () => {
    it('should create a conflict error', () => {
      const cpf = '12345678901';
      const error = UserErrorFactory.duplicateCpf(cpf);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });
  });

  describe('duplicateRg', () => {
    it('should create a conflict error', () => {
      const rg = '123456789';
      const error = UserErrorFactory.duplicateRg(rg);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
    });
  });

  describe('notFound', () => {
    it('should create a not found error', () => {
      const error = UserErrorFactory.notFound();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });

    it('should create a not found error with user id', () => {
      const userId = faker.string.uuid();
      const error = UserErrorFactory.notFound(userId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });
  });

  describe('invalidPassword', () => {
    it('should create a business logic error', () => {
      const error = UserErrorFactory.invalidPassword();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });

  describe('accountDisabled', () => {
    it('should create a business logic error', () => {
      const userId = faker.string.uuid();
      const error = UserErrorFactory.accountDisabled(userId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });

  describe('emailNotVerified', () => {
    it('should create a business logic error', () => {
      const email = faker.internet.email();
      const error = UserErrorFactory.emailNotVerified(email);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });
  });
});
