import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from '@jest/globals';
import type { ObfuscatorInfoParams } from './log.interface';
import { isDate, isPrimitive, obfuscatorInfo } from './log.utils';

// NOSONAR - Test file with faker-generated credentials for testing purposes only
describe('Log Utils', () => {
  let testPassword: string;

  beforeEach(() => {
    testPassword = faker.internet.password({ length: 12, memorable: false });
  });

  describe('isPrimitive', () => {
    // ACT & ASSERT
    it('should return true for null', () => {
      expect(isPrimitive(null)).toBe(true);
    });

    it('should return true for string', () => {
      expect(isPrimitive('test')).toBe(true);
    });

    it('should return true for number', () => {
      expect(isPrimitive(123)).toBe(true);
    });

    it('should return true for boolean', () => {
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isPrimitive(undefined)).toBe(true);
    });

    it('should return true for function', () => {
      // ARRANGE
      const func = () => {};

      // ACT
      const result = isPrimitive(func);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return false for object', () => {
      // ARRANGE
      const obj = { key: 'value' };

      // ACT
      const result = isPrimitive(obj);

      // ASSERT
      expect(result).toBe(false);
    });

    it('should return false for array', () => {
      // ARRANGE
      const arr = [1, 2, 3];

      // ACT
      const result = isPrimitive(arr);

      // ASSERT
      expect(result).toBe(false);
    });

    it('should return false for Date', () => {
      // ARRANGE
      const date = new Date();

      // ACT
      const result = isPrimitive(date);

      // ASSERT
      expect(result).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for Date object', () => {
      // ARRANGE
      const date = new Date();

      // ACT
      const result = isDate(date);

      // ASSERT
      expect(result).toBe(true);
    });

    it('should return false for string', () => {
      // ACT
      const result = isDate('2024-01-01');

      // ASSERT
      expect(result).toBe(false);
    });

    it('should return false for number', () => {
      // ACT
      const result = isDate(1234567890);

      // ASSERT
      expect(result).toBe(false);
    });

    it('should return false for object', () => {
      // ACT
      const result = isDate({ time: 'now' });

      // ASSERT
      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      // ACT
      const result = isDate(null);

      // ASSERT
      expect(result).toBe(false);
    });
  });

  describe('obfuscatorInfo', () => {
    describe('with primitive values', () => {
      it('should return null unchanged', () => {
        // ARRANGE
        const params = null;
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toBe(null);
      });

      it('should return string unchanged', () => {
        // ARRANGE
        const params = 'test string';
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toBe('test string');
      });

      it('should return number unchanged', () => {
        // ARRANGE
        const params = 42;
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toBe(42);
      });

      it('should return boolean unchanged', () => {
        // ARRANGE
        const params = true;
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toBe(true);
      });
    });

    describe('with Date values', () => {
      it('should return Date unchanged', () => {
        // ARRANGE
        const date = new Date('2024-01-01');
        const obfuscatorParams: ObfuscatorInfoParams = { params: date };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toEqual(date);
      });
    });

    describe('with arrays', () => {
      it('should obfuscate array items', () => {
        // ARRANGE
        const params = [{ password: testPassword }, { password: testPassword }]; // NOSONAR - Test data
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Array<any>;

        // ASSERT
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].password).toBe('***');
        expect(result[1].password).toBe('***');
      });

      it('should handle mixed array items', () => {
        // ARRANGE
        const params = ['string', 123, { password: testPassword }]; // NOSONAR - Test data
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Array<any>;

        // ASSERT
        expect(result[0]).toBe('string');
        expect(result[1]).toBe(123);
        expect(result[2].password).toBe('***');
      });

      it('should handle empty array', () => {
        // ARRANGE
        const params = [];
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toEqual([]);
      });
    });

    describe('with objects', () => {
      it('should obfuscate password field', () => {
        // ARRANGE
        const params = { password: testPassword, username: 'user' }; // NOSONAR - Test data
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should obfuscate multiple sensitive fields', () => {
        // ARRANGE
        const params = {
          password: testPassword, // NOSONAR - Test data
          accessToken: 'token123',
          refreshToken: 'refresh123',
          username: 'user',
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toBe('***');
        expect(result.accessToken).toBe('***');
        expect(result.refreshToken).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should be case-insensitive for field names', () => {
        // ARRANGE
        const params = {
          Password: testPassword, // NOSONAR - Test data
          PASSWORD: testPassword, // NOSONAR - Test data
          pAsSWoRd: testPassword, // NOSONAR - Test data
          username: 'user',
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.Password).toBe('***');
        expect(result.PASSWORD).toBe('***');
        expect(result.pAsSWoRd).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should handle nested objects', () => {
        // ARRANGE
        const params = {
          user: {
            password: testPassword, // NOSONAR - Test data
            profile: {
              email: 'user@test.com',
              accessToken: 'token123',
            },
          },
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.user.password).toBe('***');
        expect(result.user.profile.email).toBe('user@test.com');
        expect(result.user.profile.accessToken).toBe('***');
      });

      it('should handle deeply nested objects', () => {
        // ARRANGE
        const params = {
          level1: {
            level2: {
              level3: {
                password: testPassword, // NOSONAR - Test data
                data: 'value',
              },
            },
          },
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.level1.level2.level3.password).toBe('***');
        expect(result.level1.level2.level3.data).toBe('value');
      });

      it('should handle object with array values', () => {
        // ARRANGE
        const params = {
          password: ['pass1', 'pass2'], // NOSONAR - Test data
          tokens: [{ accessToken: 'token1' }, { accessToken: 'token2' }],
          username: 'user',
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toEqual(['***', '***']);
        expect(result.tokens[0].accessToken).toBe('***');
        expect(result.tokens[1].accessToken).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should handle null values in object', () => {
        // ARRANGE
        const params = {
          password: null,
          username: 'user',
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should handle undefined values in object', () => {
        // ARRANGE
        const params = {
          password: undefined,
          username: 'user',
        };
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toBe('***');
        expect(result.username).toBe('user');
      });

      it('should handle empty object', () => {
        // ARRANGE
        const params = {};
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toEqual({});
      });
    });

    describe('with custom fields', () => {
      const emailPatternFn = () => '[REDACTED_EMAIL]';
      const creditCardPatternFn = (value: string | number | undefined) =>
        `****${String(value).slice(-4)}`;

      it('should use custom obfuscator fields', () => {
        // ARRANGE
        const customFields = [
          {
            field: 'email',
            pattern: emailPatternFn,
          },
        ];
        const params = { email: 'user@test.com', username: 'user' };
        const obfuscatorParams: ObfuscatorInfoParams = {
          params,
          fields: customFields,
        };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.email).toBe('[REDACTED_EMAIL]');
        expect(result.username).toBe('user');
      });

      it('should apply pattern function to numeric values', () => {
        // ARRANGE
        const customFields = [
          {
            field: 'creditCard',
            pattern: creditCardPatternFn,
          },
        ];
        const params = { creditCard: 1234567890123456, username: 'user' };
        const obfuscatorParams: ObfuscatorInfoParams = {
          params,
          fields: customFields,
        };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.creditCard).toMatch(/^\*{4}\d{4}$/);
        expect(result.username).toBe('user');
      });
    });

    describe('error handling', () => {
      const errorPatternFn = () => {
        throw new Error('Pattern error');
      };

      it('should handle pattern function errors', () => {
        // ARRANGE
        const errorFields = [
          {
            field: 'password',
            pattern: errorPatternFn,
          },
        ];
        const params = { password: testPassword }; // NOSONAR - Test data
        const obfuscatorParams: ObfuscatorInfoParams = {
          params,
          fields: errorFields,
        };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams) as Record<string, any>;

        // ASSERT
        expect(result.password).toBe('***');
      });

      it('should return original params for invalid input', () => {
        // ARRANGE
        const params = Symbol('test');
        const obfuscatorParams: ObfuscatorInfoParams = { params };

        // ACT
        const result = obfuscatorInfo(obfuscatorParams);

        // ASSERT
        expect(result).toBe(params);
      });
    });
  });
});
