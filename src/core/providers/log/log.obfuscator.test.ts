import {
  OBFUSCATOR_FIELDS,
  OBFUSCATOR_REPLACEMENT,
  OBFUSCATOR_PARTIAL_INFO,
} from './log.obfuscator';

describe('log.obfuscator', () => {
  describe('OBFUSCATOR_FIELDS', () => {
    it('should contain obfuscator configuration for sensitive fields', () => {
      // Arrange - Constants are already defined

      // Act & Assert
      expect(OBFUSCATOR_FIELDS).toBeDefined();
      expect(Array.isArray(OBFUSCATOR_FIELDS)).toBe(true);
      expect(OBFUSCATOR_FIELDS.length).toBeGreaterThan(0);
    });

    it('should have all required properties in each item', () => {
      // Arrange - Constants are already defined

      // Act
      for (const item of OBFUSCATOR_FIELDS) {
        // Assert
        expect(item).toHaveProperty('field');
        expect(item).toHaveProperty('pattern');
        expect(typeof item.field).toBe('string');
        expect(typeof item.pattern).toBe('function');
      }
    });

    it('should obfuscate password fields with asterisks', () => {
      // Arrange
      const passwordField = OBFUSCATOR_FIELDS.find(
        (f) => f.field === 'password',
      );

      // Act & Assert
      expect(passwordField).toBeDefined();
      expect(passwordField?.pattern('test')).toBe('***');
    });

    it('should obfuscate token fields with asterisks', () => {
      // Arrange
      const tokenFields = ['accessToken', 'refreshToken', 'authToken'];

      // Act & Assert
      for (const fieldName of tokenFields) {
        const field = OBFUSCATOR_FIELDS.find((f) => f.field === fieldName);
        expect(field).toBeDefined();
        expect(field?.pattern('token123')).toBe('***');
      }
    });

    it('should partially obfuscate phoneNumber field', () => {
      // Arrange
      const phoneField = OBFUSCATOR_FIELDS.find(
        (f) => f.field === 'phoneNumber',
      );

      // Act
      const result = phoneField?.pattern('1234567890');

      // Assert
      expect(phoneField).toBeDefined();
      expect(result).toBe('123*****90');
    });
  });

  describe('OBFUSCATOR_REPLACEMENT', () => {
    it('should have correct replacement value', () => {
      // Arrange - Constant is already defined

      // Act & Assert
      expect(OBFUSCATOR_REPLACEMENT).toBe('****');
    });
  });

  describe('OBFUSCATOR_PARTIAL_INFO', () => {
    it('should have correct partial info value', () => {
      // Arrange - Constant is already defined

      // Act & Assert
      expect(OBFUSCATOR_PARTIAL_INFO).toBe('***');
    });
  });
});
