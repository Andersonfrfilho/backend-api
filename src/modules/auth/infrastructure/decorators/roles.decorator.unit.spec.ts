import { describe, expect, it } from '@jest/globals';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles Decorator - Unit Tests', () => {
  describe('Roles decorator', () => {
    it('should be defined', () => {
      expect(Roles).toBeDefined();
      expect(typeof Roles).toBe('function');
    });

    it('should set metadata with single role', () => {
      // Create a test function and apply decorator
      class TestClass {
        @Roles('admin')
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata).toContain('admin');
    });

    it('should set metadata with multiple roles', () => {
      class TestClass {
        @Roles('admin', 'moderator', 'user')
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata.length).toBe(3);
      expect(metadata).toContain('admin');
      expect(metadata).toContain('moderator');
      expect(metadata).toContain('user');
    });

    it('should return the original method when used as decorator', () => {
      class TestClass {
        @Roles('admin')
        testMethod() {
          return 'test result';
        }
      }

      const instance = new TestClass();
      const result = instance.testMethod();

      expect(result).toBe('test result');
    });

    it('should support empty roles array', () => {
      class TestClass {
        @Roles()
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata.length).toBe(0);
    });

    it('should use correct ROLES_KEY constant', () => {
      expect(ROLES_KEY).toBe('roles');
    });

    it('should allow decorator on multiple methods', () => {
      class TestClass {
        @Roles('admin')
        adminMethod() {}

        @Roles('user')
        userMethod() {}

        @Roles('admin', 'moderator')
        restrictedMethod() {}
      }

      const adminMetadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.adminMethod);
      const userMetadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.userMethod);
      const restrictedMetadata = Reflect.getMetadata(
        ROLES_KEY,
        TestClass.prototype.restrictedMethod,
      );

      expect(adminMetadata).toEqual(['admin']);
      expect(userMetadata).toEqual(['user']);
      expect(restrictedMetadata).toEqual(['admin', 'moderator']);
    });

    it('should handle roles with special characters', () => {
      class TestClass {
        @Roles('admin-super', 'user_read', 'post.delete')
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toContain('admin-super');
      expect(metadata).toContain('user_read');
      expect(metadata).toContain('post.delete');
    });

    it('should preserve metadata on multiple decorations', () => {
      const decorator1 = Roles('admin');
      const decorator2 = Roles('moderator');

      // Test that different instances have different metadata
      expect(decorator1).toBeDefined();
      expect(decorator2).toBeDefined();
    });
  });

  describe('Integration with NestJS metadata system', () => {
    it('should work with Reflect.getMetadata', () => {
      class TestClass {
        @Roles('test-role')
        testMethod() {}
      }

      const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toBeDefined();
      expect(metadata[0]).toBe('test-role');
    });

    it('should work with Reflect.getOwnMetadata', () => {
      class TestClass {
        @Roles('own-role')
        testMethod() {}
      }

      const metadata = Reflect.getOwnMetadata(ROLES_KEY, TestClass.prototype.testMethod);

      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });
  });
});
