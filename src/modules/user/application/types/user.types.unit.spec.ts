import { describe, expect, it } from '@jest/globals';
import { User } from '@modules/shared/domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from './user.types';

describe('User Types - Unit Tests', () => {
  describe('CreateUserParams interface', () => {
    it('should accept partial User properties', () => {
      const params: CreateUserParams = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(params).toBeDefined();
      expect(params.email).toBe('test@example.com');
      expect(params.password).toBe('password123');
    });

    it('should allow empty object', () => {
      const params: CreateUserParams = {};

      expect(params).toBeDefined();
      expect(Object.keys(params).length).toBe(0);
    });

    it('should allow all User properties', () => {
      const params: CreateUserParams = {
        id: 'uuid-123',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(params.id).toBeDefined();
      expect(params.email).toBeDefined();
      expect(params.password).toBeDefined();
      expect(params.firstName).toBeDefined();
      expect(params.lastName).toBeDefined();
    });

    it('should not require any properties', () => {
      const params: CreateUserParams = {};

      expect(params).toBeDefined();
    });

    it('should be compatible with User interface', () => {
      const user: User = {
        id: 'uuid-123',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      } as any;

      const params: CreateUserParams = user;

      expect(params).toEqual(user);
    });
  });

  describe('UpdateUserParams interface', () => {
    it('should accept partial User properties', () => {
      const params: UpdateUserParams = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      expect(params).toBeDefined();
      expect(params.firstName).toBe('Jane');
      expect(params.lastName).toBe('Smith');
    });

    it('should allow single property update', () => {
      const params: UpdateUserParams = {
        email: 'newemail@example.com',
      };

      expect(params).toBeDefined();
      expect(params.email).toBe('newemail@example.com');
      expect(params.password).toBeUndefined();
    });

    it('should allow empty object', () => {
      const params: UpdateUserParams = {};

      expect(params).toBeDefined();
      expect(Object.keys(params).length).toBe(0);
    });

    it('should allow password update', () => {
      const params: UpdateUserParams = {
        password: 'newpassword123',
      };

      expect(params).toBeDefined();
      expect(params.password).toBe('newpassword123');
    });

    it('should allow multiple property updates', () => {
      const params: UpdateUserParams = {
        email: 'newemail@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'newpassword123',
      };

      expect(params.email).toBe('newemail@example.com');
      expect(params.firstName).toBe('Jane');
      expect(params.lastName).toBe('Smith');
      expect(params.password).toBe('newpassword123');
    });

    it('should not require any properties', () => {
      const params: UpdateUserParams = {};

      expect(params).toBeDefined();
    });

    it('should be compatible with User interface', () => {
      const user: Partial<User> = {
        firstName: 'Updated',
        email: 'updated@example.com',
      };

      const params: UpdateUserParams = user;

      expect(params).toEqual(user);
    });
  });

  describe('Type compatibility', () => {
    it('should allow CreateUserParams to be used as UpdateUserParams', () => {
      const createParams: CreateUserParams = {
        email: 'test@example.com',
        password: 'password123',
      };

      const updateParams: UpdateUserParams = createParams;

      expect(updateParams).toEqual(createParams);
    });

    it('should allow UpdateUserParams to be used as CreateUserParams', () => {
      const updateParams: UpdateUserParams = {
        firstName: 'John',
      };

      const createParams: CreateUserParams = updateParams;

      expect(createParams).toEqual(updateParams);
    });

    it('should handle both types with same properties', () => {
      const props = {
        email: 'test@example.com',
        password: 'password123',
      };

      const createParams: CreateUserParams = props;
      const updateParams: UpdateUserParams = props;

      expect(createParams).toEqual(updateParams);
    });
  });

  describe('Type usage in functions', () => {
    it('should work with function accepting CreateUserParams', () => {
      const createUser = (params: CreateUserParams) => {
        return { success: true, ...params };
      };

      const result = createUser({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.email).toBe('test@example.com');
    });

    it('should work with function accepting UpdateUserParams', () => {
      const updateUser = (id: string, params: UpdateUserParams) => {
        return { id, success: true, ...params };
      };

      const result = updateUser('uuid-123', {
        firstName: 'Updated',
      });

      expect(result.id).toBe('uuid-123');
      expect(result.success).toBe(true);
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('Type inference', () => {
    it('should infer types correctly for CreateUserParams', () => {
      const params: CreateUserParams = {
        email: 'test@example.com',
      };

      // Should allow accessing the property
      const email: string | undefined = params.email;

      expect(email).toBe('test@example.com');
    });

    it('should infer types correctly for UpdateUserParams', () => {
      const params: UpdateUserParams = {
        firstName: 'John',
      };

      // Should allow accessing the property
      const firstName: string | undefined = params.firstName;

      expect(firstName).toBe('John');
    });
  });

  describe('Optional properties', () => {
    it('should mark all properties as optional for CreateUserParams', () => {
      const params: CreateUserParams = {};

      // All properties should be optional
      expect(params.id).toBeUndefined();
      expect(params.email).toBeUndefined();
      expect(params.password).toBeUndefined();
    });

    it('should mark all properties as optional for UpdateUserParams', () => {
      const params: UpdateUserParams = {};

      // All properties should be optional
      expect(params.id).toBeUndefined();
      expect(params.email).toBeUndefined();
      expect(params.password).toBeUndefined();
    });
  });
});
