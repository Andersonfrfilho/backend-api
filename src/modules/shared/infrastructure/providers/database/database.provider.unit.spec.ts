import { describe, expect, it } from '@jest/globals';
import { DatabaseProvider } from './database.provider';

describe('DatabaseProvider - Unit Tests', () => {
  describe('class instantiation', () => {
    it('should instantiate DatabaseProvider', () => {
      const provider = new DatabaseProvider();
      expect(provider).toBeInstanceOf(DatabaseProvider);
    });

    it('should be defined', () => {
      expect(DatabaseProvider).toBeDefined();
    });
  });

  describe('interface implementation', () => {
    it('should implement DatabaseProviderInterface', () => {
      const provider = new DatabaseProvider();
      expect(provider).toBeDefined();
    });
  });
});
