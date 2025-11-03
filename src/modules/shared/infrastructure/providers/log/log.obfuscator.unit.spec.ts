import { describe, expect, it } from '@jest/globals';
import { OBFUSCATOR_FIELDS } from './log.obfuscator';

describe('Log Obfuscator', () => {
  describe('OBFUSCATOR_FIELDS', () => {
    const getPasswordField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'password');
    const getTokenField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'accessToken');
    const getRefreshField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'refreshToken');
    const getAuthField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'authorization');
    const getAuthTokenField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'authToken');
    const getPhoneField = () => OBFUSCATOR_FIELDS.find((f) => f.field === 'phoneNumber');
    const getFieldNames = () => OBFUSCATOR_FIELDS.map((f) => f.field);
    const findDuplicates = (names: string[]) =>
      names.filter((name, index) => names.indexOf(name) !== index);

    it('should be an array', () => {
      expect(Array.isArray(OBFUSCATOR_FIELDS)).toBe(true);
    });

    it('should have required sensitive fields', () => {
      const requiredFields = [
        'password',
        'oldPassword',
        'newPassword',
        'accessToken',
        'refreshToken',
        'authorization',
        'authToken',
      ];
      const fieldNames = getFieldNames();

      for (const requiredField of requiredFields) {
        expect(fieldNames).toContain(requiredField);
      }
    });

    it('should have at least 7 fields', () => {
      expect(OBFUSCATOR_FIELDS.length).toBeGreaterThanOrEqual(7);
    });

    describe('field structure', () => {
      it('each field should have field property (string)', () => {
        for (const field of OBFUSCATOR_FIELDS) {
          expect(field).toHaveProperty('field');
          expect(typeof field.field).toBe('string');
          expect(field.field.length).toBeGreaterThan(0);
        }
      });

      it('each field should have pattern property (function)', () => {
        for (const field of OBFUSCATOR_FIELDS) {
          expect(field).toHaveProperty('pattern');
          expect(typeof field.pattern).toBe('function');
        }
      });

      it('field names should be valid identifiers', () => {
        const validPattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

        for (const field of OBFUSCATOR_FIELDS) {
          expect(validPattern.test(field.field)).toBe(true);
        }
      });
    });

    describe('pattern functions', () => {
      it('password pattern should return masking value', () => {
        const result = getPasswordField()?.pattern('testpassword');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });

      it('accessToken pattern should return masking value', () => {
        const result = getTokenField()?.pattern('token123');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });

      it('refreshToken pattern should return masking value', () => {
        const result = getRefreshField()?.pattern('refresh456');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });

      it('authorization pattern should return masking value', () => {
        const result = getAuthField()?.pattern('Bearer token');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });

      it('authToken pattern should return masking value', () => {
        const result = getAuthTokenField()?.pattern('auth789');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      });

      it('phoneNumber pattern should partially mask value', () => {
        const result = getPhoneField()?.pattern('1234567890');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toMatch(/^\d{3}\*+\d{2}$/);
      });

      it('patterns should be consistent for same input', () => {
        const testValue = 'testvalue';
        const result1 = getPasswordField()?.pattern(testValue);
        const result2 = getPasswordField()?.pattern(testValue);

        expect(result1).toBe(result2);
      });

      it('patterns should handle empty strings', () => {
        for (const field of OBFUSCATOR_FIELDS) {
          const result = field.pattern('');
          expect(typeof result).toBe('string');
        }
      });

      it('patterns should handle numbers', () => {
        // Only phoneNumber pattern accepts number parameter
        const phoneField = getPhoneField();
        const result = phoneField?.pattern(12345);
        expect(typeof result).toBe('string');
        expect(result).toBeTruthy();
      });

      it('all patterns should produce non-empty strings', () => {
        for (const field of OBFUSCATOR_FIELDS) {
          const result = field.pattern('value');
          expect(result).toBeTruthy();
          expect(result.length).toBeGreaterThan(0);
        }
      });
    });

    describe('field uniqueness', () => {
      it('each field should have unique name', () => {
        const fieldNames = getFieldNames();
        const uniqueNames = new Set(fieldNames);

        expect(uniqueNames.size).toBe(fieldNames.length);
      });

      it('no duplicate field definitions', () => {
        const fieldNames = getFieldNames();
        const duplicates = findDuplicates(fieldNames);

        expect(duplicates.length).toBe(0);
      });
    });

    describe('sensitive fields coverage', () => {
      it('should cover password-related fields', () => {
        const passwordFields = ['password', 'oldPassword', 'newPassword'];
        const fieldNames = getFieldNames();

        for (const field of passwordFields) {
          expect(fieldNames).toContain(field);
        }
      });

      it('should cover token-related fields', () => {
        const tokenFields = ['accessToken', 'refreshToken', 'authToken'];
        const fieldNames = getFieldNames();

        for (const field of tokenFields) {
          expect(fieldNames).toContain(field);
        }
      });

      it('should cover header-related fields', () => {
        const headerFields = ['authorization'];
        const fieldNames = getFieldNames();

        for (const field of headerFields) {
          expect(fieldNames).toContain(field);
        }
      });
    });
  });
});
