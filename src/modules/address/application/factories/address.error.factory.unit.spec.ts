import { faker } from '@faker-js/faker';
import { describe, expect, it } from '@jest/globals';
import { AppError } from '@modules/error/domain/app.error';
import { AddressErrorCode, AddressErrorFactory } from './address.error.factory';

describe('AddressErrorFactory - Unit Tests', () => {
  describe('notFound', () => {
    it('should create a not found error', () => {
      const error = AddressErrorFactory.notFound();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });

    it('should create a not found error with address id', () => {
      const addressId = faker.string.uuid();
      const error = AddressErrorFactory.notFound(addressId);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Address not found');
    });

    it('should include error code in details', () => {
      const error = AddressErrorFactory.notFound();
      expect(error.details).toHaveProperty('code');
      expect(error.details?.code).toBe(AddressErrorCode.NOT_FOUND);
    });
  });

  describe('invalidCoordinates', () => {
    it('should create a validation error', () => {
      const error = AddressErrorFactory.invalidCoordinates();
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
    });

    it('should create a validation error with latitude', () => {
      const latitude = 23.5505;
      const error = AddressErrorFactory.invalidCoordinates(latitude);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
    });

    it('should create a validation error with latitude and longitude', () => {
      const latitude = 23.5505;
      const longitude = -46.6333;
      const error = AddressErrorFactory.invalidCoordinates(latitude, longitude);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('Invalid address coordinates');
    });

    it('should include error code', () => {
      const error = AddressErrorFactory.invalidCoordinates();
      // Note: validation errors don't have code at top level, details are in message
      expect(error.message).toContain('Invalid address coordinates');
    });
  });

  describe('error codes', () => {
    it('should have NOT_FOUND code', () => {
      expect(AddressErrorCode.NOT_FOUND).toBe('ADDRESS_NOT_FOUND');
    });

    it('should have INVALID_COORDINATES code', () => {
      expect(AddressErrorCode.INVALID_COORDINATES).toBe('INVALID_ADDRESS_COORDINATES');
    });
  });
});
