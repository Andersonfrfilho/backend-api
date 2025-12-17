import { describe, expect, it } from '@jest/globals';
import { AppError, ErrorType } from './app.error';

describe('AppError - Extended Coverage - Unit Tests', () => {
  describe('constructor and initialization', () => {
    it('should initialize with required properties', () => {
      const payload = {
        type: ErrorType.VALIDATION,
        message: 'Test error',
        statusCode: 400,
      };

      const error = new AppError(payload);

      expect(error).toBeInstanceOf(AppError);
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('AppError');
    });

    it('should set optional code property', () => {
      const payload = {
        type: ErrorType.CONFLICT,
        message: 'Conflict error',
        statusCode: 409,
        code: 'DUPLICATE_EMAIL',
      };

      const error = new AppError(payload);

      expect(error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should set optional details property', () => {
      const details = { field: 'email', reason: 'already exists' };
      const payload = {
        type: ErrorType.CONFLICT,
        message: 'Conflict error',
        statusCode: 409,
        details,
      };

      const error = new AppError(payload);

      expect(error.details).toEqual(details);
    });

    it('should set optional requestId', () => {
      const requestId = 'req-123-456';
      const payload = {
        type: ErrorType.VALIDATION,
        message: 'Validation error',
        statusCode: 400,
        requestId,
      };

      const error = new AppError(payload);

      expect(error.requestId).toBe(requestId);
    });

    it('should generate timestamp if not provided', () => {
      const payload = {
        type: ErrorType.VALIDATION,
        message: 'Test error',
        statusCode: 400,
      };

      const error = new AppError(payload);

      expect(error.timestamp).toBeDefined();
      expect(typeof error.timestamp).toBe('string');
      // Should be valid ISO string
      expect(new Date(error.timestamp).getTime()).toBeGreaterThan(0);
    });

    it('should use provided timestamp', () => {
      const customTimestamp = '2025-12-10T12:00:00Z';
      const payload = {
        type: ErrorType.VALIDATION,
        message: 'Test error',
        statusCode: 400,
        timestamp: customTimestamp,
      };

      const error = new AppError(payload);

      expect(error.timestamp).toBe(customTimestamp);
    });
  });

  describe('different error types', () => {
    it('should handle AUTHENTICATION error type', () => {
      const error = new AppError({
        type: ErrorType.AUTHENTICATION,
        message: 'Authentication failed',
        statusCode: 401,
      });

      expect(error.type).toBe(ErrorType.AUTHENTICATION);
    });

    it('should handle AUTHORIZATION error type', () => {
      const error = new AppError({
        type: ErrorType.AUTHORIZATION,
        message: 'Forbidden',
        statusCode: 403,
      });

      expect(error.type).toBe(ErrorType.AUTHORIZATION);
    });

    it('should handle NOT_FOUND error type', () => {
      const error = new AppError({
        type: ErrorType.NOT_FOUND,
        message: 'Not found',
        statusCode: 404,
      });

      expect(error.type).toBe(ErrorType.NOT_FOUND);
    });

    it('should handle BUSINESS_LOGIC error type', () => {
      const error = new AppError({
        type: ErrorType.BUSINESS_LOGIC,
        message: 'Invalid operation',
        statusCode: 422,
      });

      expect(error.type).toBe(ErrorType.BUSINESS_LOGIC);
    });

    it('should handle INTERNAL_SERVER error type', () => {
      const error = new AppError({
        type: ErrorType.INTERNAL_SERVER,
        message: 'Internal server error',
        statusCode: 500,
      });

      expect(error.type).toBe(ErrorType.INTERNAL_SERVER);
    });
  });

  describe('toJSON method', () => {
    it('should return all properties in JSON format', () => {
      const payload = {
        type: ErrorType.CONFLICT,
        message: 'Duplicate resource',
        statusCode: 409,
        code: 'DUPLICATE_ENTRY',
        details: { field: 'email' },
        requestId: 'req-123',
      };

      const error = new AppError(payload);
      const json = error.toJSON();

      expect(json.type).toBe(ErrorType.CONFLICT);
      expect(json.message).toBe('Duplicate resource');
      expect(json.statusCode).toBe(409);
      expect(json.code).toBe('DUPLICATE_ENTRY');
      expect(json.details).toEqual({ field: 'email' });
      expect(json.requestId).toBe('req-123');
      expect(json.timestamp).toBeDefined();
    });

    it('should include timestamp in JSON', () => {
      const error = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Invalid input',
        statusCode: 400,
      });

      const json = error.toJSON();

      expect(json.timestamp).toBeDefined();
      expect(typeof json.timestamp).toBe('string');
    });

    it('should handle undefined optional properties', () => {
      const error = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Error',
        statusCode: 400,
      });

      const json = error.toJSON();

      expect(json.code).toBeUndefined();
      expect(json.details).toBeUndefined();
      expect(json.requestId).toBeUndefined();
    });
  });

  describe('error instanceof checks', () => {
    it('should be instance of Error', () => {
      const error = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Test',
        statusCode: 400,
      });

      expect(error).toBeInstanceOf(Error);
    });

    it('should be instance of AppError', () => {
      const error = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Test',
        statusCode: 400,
      });

      expect(error).toBeInstanceOf(AppError);
    });

    it('should maintain prototype chain', () => {
      const error = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Test',
        statusCode: 400,
      });

      expect(error instanceof AppError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle error with all properties populated', () => {
      const error = new AppError({
        type: ErrorType.CONFLICT,
        message: 'Email already exists',
        statusCode: 409,
        code: 'DUPLICATE_EMAIL',
        details: {
          field: 'email',
          value: 'test@example.com',
          existingId: 'user-123',
        },
        timestamp: '2025-12-10T10:00:00Z',
        requestId: 'req-abc-def',
      });

      expect(error.type).toBe(ErrorType.CONFLICT);
      expect(error.message).toBe('Email already exists');
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('DUPLICATE_EMAIL');
      expect(error.details.field).toBe('email');
      expect(error.timestamp).toBe('2025-12-10T10:00:00Z');
      expect(error.requestId).toBe('req-abc-def');
    });

    it('should create different error instances independently', () => {
      const error1 = new AppError({
        type: ErrorType.VALIDATION,
        message: 'Error 1',
        statusCode: 400,
      });

      const error2 = new AppError({
        type: ErrorType.NOT_FOUND,
        message: 'Error 2',
        statusCode: 404,
      });

      expect(error1.type).not.toBe(error2.type);
      expect(error1.message).not.toBe(error2.message);
      expect(error1.statusCode).not.toBe(error2.statusCode);
    });
  });
});
