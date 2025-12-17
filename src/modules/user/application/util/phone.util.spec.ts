import { parsePhone } from './phone.util';

describe('Phone Utility', () => {
  describe('parsePhone', () => {
    it('should parse a valid phone number', () => {
      const result = parsePhone('+55993056772');

      expect(result).toEqual({
        country: '+55',
        area: '99',
        number: '993056772',
      });
    });

    it('should parse phone with spaces', () => {
      const result = parsePhone('+55 99 9 3056 772');

      expect(result.country).toBe('+55');
      expect(result.area).toBe('99');
      expect(result.number).toBe('993056772');
    });

    it('should throw error for invalid format', () => {
      expect(() => parsePhone('1234567')).toThrow();
      expect(() => parsePhone('invalid')).toThrow();
    });
  });
});
