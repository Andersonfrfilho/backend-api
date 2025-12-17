import { describe, expect, it } from '@jest/globals';
import { parsePhone } from './phone.util';

describe('Phone Utility - Unit Tests', () => {
  describe('parsePhone', () => {
    it('should parse valid Brazilian phone number', () => {
      const result = parsePhone('5585993056772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
      expect(result.number).toBe('993056772');
    });

    it('should parse phone number with formatting characters', () => {
      const result = parsePhone('+55 (85) 99305-6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
      expect(result.number).toBe('993056772');
    });

    it('should parse phone number with only dashes', () => {
      const result = parsePhone('55-85-99305-6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
    });

    it('should parse phone number with spaces', () => {
      const result = parsePhone('55 85 99305 6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
    });

    it('should parse phone number with parentheses', () => {
      const result = parsePhone('+55(85)99305-6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
      expect(result.number).toBe('993056772');
    });

    it('should throw error for too short phone number', () => {
      expect(() => parsePhone('558599305')).toThrow();
    });

    it('should throw error for too long phone number', () => {
      expect(() => parsePhone('558599305677212345')).toThrow();
    });

    it('should throw error for empty string', () => {
      expect(() => parsePhone('')).toThrow();
    });

    it('should throw error for phone with letters', () => {
      expect(() => parsePhone('558599305ABC')).toThrow();
    });

    it('should return object with country property', () => {
      const result = parsePhone('5585993056772');

      expect(result).toHaveProperty('country');
    });

    it('should return object with area property', () => {
      const result = parsePhone('5585993056772');

      expect(result).toHaveProperty('area');
    });

    it('should return object with number property', () => {
      const result = parsePhone('5585993056772');

      expect(result).toHaveProperty('number');
    });

    it('should extract country code correctly', () => {
      const result = parsePhone('5585993056772');

      expect(result.country).toBe('+55');
      expect(typeof result.country).toBe('string');
      expect(result.country).toMatch(/^\+\d+$/);
    });

    it('should extract area code correctly', () => {
      const result = parsePhone('5585993056772');

      expect(result.area).toBe('85');
      expect(result.area.length).toBe(2);
    });

    it('should extract number correctly', () => {
      const result = parsePhone('5585993056772');

      expect(result.number).toBe('993056772');
      expect(result.number.length).toBe(9);
    });

    it('should handle different area codes', () => {
      const areaCodesTest = [
        { input: '5511993056772', expectedArea: '11' }, // São Paulo
        { input: '5521993056772', expectedArea: '21' }, // Rio
        { input: '5585993056772', expectedArea: '85' }, // Ceará
      ];

      areaCodesTest.forEach(({ input, expectedArea }) => {
        const result = parsePhone(input);
        expect(result.area).toBe(expectedArea);
      });
    });

    it('should handle different number lengths within valid range', () => {
      // Brazilian mobile: 9 + 8 digits = 9 digits total in number part
      const result = parsePhone('5585993056772');

      expect(result.number).toBeDefined();
      expect(result.number.length).toBe(9);
    });

    it('should strip all non-numeric characters', () => {
      const result = parsePhone('+55 (85) 9#9@3!0&5-6*7(7)2');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
    });

    it('should work with plus sign at beginning', () => {
      const result = parsePhone('+5585993056772');

      expect(result.country).toBe('+55');
    });

    it('should work without plus sign', () => {
      const result = parsePhone('5585993056772');

      expect(result.country).toBe('+55');
    });

    it('should parse complete phone with all formatting', () => {
      const result = parsePhone('+55 (85) 9 9305-6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
      expect(result.number).toBe('993056772');
    });

    it('should handle all digits without separators', () => {
      const result = parsePhone('5585993056772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
      expect(result.number).toBe('993056772');
    });
  });

  describe('ParsedPhone return type', () => {
    it('should return object with all required properties', () => {
      const result = parsePhone('5585993056772');

      expect(result).toHaveProperty('country');
      expect(result).toHaveProperty('area');
      expect(result).toHaveProperty('number');
      expect(Object.keys(result).length).toBe(3);
    });

    it('should return string values', () => {
      const result = parsePhone('5585993056772');

      expect(typeof result.country).toBe('string');
      expect(typeof result.area).toBe('string');
      expect(typeof result.number).toBe('string');
    });

    it('should not have extra properties', () => {
      const result = parsePhone('5585993056772');

      expect(Object.keys(result).length).toBe(3);
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid phone format', () => {
      expect(() => parsePhone('invalid')).toThrow();
    });

    it('should throw error for null input', () => {
      expect(() => parsePhone(null as any)).toThrow();
    });

    it('should throw error for undefined input', () => {
      expect(() => parsePhone(undefined as any)).toThrow();
    });

    it('should throw specific error factory error', () => {
      expect(() => parsePhone('123')).toThrow();
    });

    it('should throw for numbers only', () => {
      // Too short: only 10 digits instead of 13
      expect(() => parsePhone('1234567890')).toThrow();
    });

    it('should throw for whitespace only', () => {
      expect(() => parsePhone('     ')).toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle phone with only plus signs and numbers', () => {
      const result = parsePhone('+55+85+99305+6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
    });

    it('should handle phone with mixed separators', () => {
      const result = parsePhone('+55-(85) 9.9305-6772');

      expect(result).toBeDefined();
      expect(result.country).toBe('+55');
      expect(result.area).toBe('85');
    });

    it('should preserve leading zeros in area code', () => {
      const result = parsePhone('5501993056772');

      expect(result.area).toBe('01');
    });

    it('should handle area codes with zero', () => {
      const result = parsePhone('5502993056772');

      expect(result.area).toBe('02');
    });
  });
});
