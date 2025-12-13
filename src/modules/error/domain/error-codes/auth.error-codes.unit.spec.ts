import { describe, expect, it } from '@jest/globals';
import { AuthErrorCode } from './auth.error-codes';

describe('AuthErrorCode - Unit Tests', () => {
  describe('enum values', () => {
    it('should have INVALID_CREDENTIALS error code', () => {
      expect(AuthErrorCode.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
    });

    it('should have TOKEN_EXPIRED error code', () => {
      expect(AuthErrorCode.TOKEN_EXPIRED).toBe('TOKEN_EXPIRED');
    });

    it('should have TOKEN_INVALID error code', () => {
      expect(AuthErrorCode.TOKEN_INVALID).toBe('TOKEN_INVALID');
    });

    it('should have REFRESH_TOKEN_EXPIRED error code', () => {
      expect(AuthErrorCode.REFRESH_TOKEN_EXPIRED).toBe('REFRESH_TOKEN_EXPIRED');
    });

    it('should have UNAUTHORIZED_ACCESS error code', () => {
      expect(AuthErrorCode.UNAUTHORIZED_ACCESS).toBe('UNAUTHORIZED_ACCESS');
    });
  });

  describe('enum structure', () => {
    it('should have all expected error codes', () => {
      const codes = Object.values(AuthErrorCode);
      expect(codes).toHaveLength(5);
      expect(codes).toContain('INVALID_CREDENTIALS');
      expect(codes).toContain('TOKEN_EXPIRED');
      expect(codes).toContain('TOKEN_INVALID');
      expect(codes).toContain('REFRESH_TOKEN_EXPIRED');
      expect(codes).toContain('UNAUTHORIZED_ACCESS');
    });
  });
});
