import { describe, expect, it } from '@jest/globals';
import { UserErrorCode } from './user.error-codes';

describe('UserErrorCode - Unit Tests', () => {
  describe('enum values', () => {
    it('should have DUPLICATE_EMAIL error code', () => {
      expect(UserErrorCode.DUPLICATE_EMAIL).toBe('DUPLICATE_EMAIL');
    });

    it('should have DUPLICATE_CPF error code', () => {
      expect(UserErrorCode.DUPLICATE_CPF).toBe('DUPLICATE_CPF');
    });

    it('should have DUPLICATE_RG error code', () => {
      expect(UserErrorCode.DUPLICATE_RG).toBe('DUPLICATE_RG');
    });

    it('should have USER_NOT_FOUND error code', () => {
      expect(UserErrorCode.USER_NOT_FOUND).toBe('USER_NOT_FOUND');
    });

    it('should have INVALID_PASSWORD error code', () => {
      expect(UserErrorCode.INVALID_PASSWORD).toBe('INVALID_PASSWORD');
    });

    it('should have ACCOUNT_DISABLED error code', () => {
      expect(UserErrorCode.ACCOUNT_DISABLED).toBe('ACCOUNT_DISABLED');
    });

    it('should have EMAIL_NOT_VERIFIED error code', () => {
      expect(UserErrorCode.EMAIL_NOT_VERIFIED).toBe('EMAIL_NOT_VERIFIED');
    });
  });

  describe('enum structure', () => {
    it('should have all expected error codes', () => {
      const codes = Object.values(UserErrorCode);
      expect(codes).toHaveLength(7);
      expect(codes).toContain('DUPLICATE_EMAIL');
      expect(codes).toContain('DUPLICATE_CPF');
      expect(codes).toContain('DUPLICATE_RG');
      expect(codes).toContain('USER_NOT_FOUND');
      expect(codes).toContain('INVALID_PASSWORD');
      expect(codes).toContain('ACCOUNT_DISABLED');
      expect(codes).toContain('EMAIL_NOT_VERIFIED');
    });
  });
});
