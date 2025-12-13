import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { MethodNotImplementedErrorFactory } from './method-not-implemented.error.factory';

describe('MethodNotImplementedErrorFactory - Unit Tests', () => {
  describe('methodNotImplemented', () => {
    it('should create a business logic error', () => {
      const error = MethodNotImplementedErrorFactory.methodNotImplemented();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
    });

    it('should create error with method name', () => {
      const methodName = 'getUserById';
      const error = MethodNotImplementedErrorFactory.methodNotImplemented(methodName);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
      expect(error.message).toContain('not implemented');
    });

    it('should handle various method names', () => {
      const testCases = ['findById', 'create', 'update', 'delete', 'list'];

      testCases.forEach((method) => {
        const error = MethodNotImplementedErrorFactory.methodNotImplemented(method);
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(422);
      });
    });

    it('should handle undefined method name', () => {
      const error = MethodNotImplementedErrorFactory.methodNotImplemented();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(422);
      expect(error.message).toBeDefined();
    });
  });
});
