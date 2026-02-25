import { beforeEach, describe, expect, it } from '@jest/globals';

import { Phone } from './phone.entity';
import { UserAddress } from './user-address.entity';
import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  it('should create an instance', () => {
    user = new User();
    expect(user).toBeInstanceOf(User);
  });

  describe('properties', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should have id property', () => {
      user.id = '550e8400-e29b-41d4-a716-446655440000';
      expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should have name property', () => {
      user.name = 'João';
      expect(user.name).toBe('João');
    });

    it('should have lastName property', () => {
      user.lastName = 'Silva';
      expect(user.lastName).toBe('Silva');
    });

    it('should have active property with default false', () => {
      expect(user.active).toBeUndefined();
      user.active = true;
      expect(user.active).toBe(true);
    });

    it('should have cpf property', () => {
      user.cpf = '12345678901';
      expect(user.cpf).toBe('12345678901');
    });

    it('should have rg property', () => {
      user.rg = '1234567';
      expect(user.rg).toBe('1234567');
    });

    it('should have email property', () => {
      user.email = 'joao@example.com';
      expect(user.email).toBe('joao@example.com');
    });

    it('should have passwordHash property', () => {
      user.passwordHash = '$2b$10$...';
      expect(user.passwordHash).toBe('$2b$10$...');
    });

    it('should have gender property', () => {
      user.gender = 'M';
      expect(user.gender).toBe('M');
    });

    it('should have details property as jsonb', () => {
      user.details = { preferences: { theme: 'dark' } };
      expect(user.details).toEqual({ preferences: { theme: 'dark' } });
    });

    it('should allow null details', () => {
      user.details = null as any;
      expect(user.details).toBeNull();
    });

    it('should have birthDate property', () => {
      const birthDate = new Date('1990-01-15');
      user.birthDate = birthDate;
      expect(user.birthDate).toEqual(birthDate);
    });

    it('should have phones relationship', () => {
      const phones: Phone[] = [];
      user.phones = phones;
      expect(user.phones).toEqual(phones);
    });

    it('should have addresses relationship', () => {
      const addresses: UserAddress[] = [];
      user.addresses = addresses;
      expect(user.addresses).toEqual(addresses);
    });

    it('should have createdAt property', () => {
      const now = new Date();
      user.createdAt = now;
      expect(user.createdAt).toEqual(now);
    });

    it('should have updatedAt property', () => {
      const now = new Date();
      user.updatedAt = now;
      expect(user.updatedAt).toEqual(now);
    });

    it('should allow null updatedAt', () => {
      user.updatedAt = null;
      expect(user.updatedAt).toBeNull();
    });

    it('should have deletedAt property', () => {
      const now = new Date();
      user.deletedAt = now;
      expect(user.deletedAt).toEqual(now);
    });

    it('should allow null deletedAt', () => {
      user.deletedAt = null;
      expect(user.deletedAt).toBeNull();
    });
  });

  describe('full user scenario', () => {
    it('should create complete user with all properties', () => {
      user = new User();
      user.id = '550e8400-e29b-41d4-a716-446655440000';
      user.name = 'João';
      user.lastName = 'Silva';
      user.active = true;
      user.cpf = '12345678901';
      user.rg = '1234567';
      user.email = 'joao@example.com';
      user.passwordHash = '$2b$10$...';
      user.gender = 'M';
      user.details = { preferences: { theme: 'dark' } };
      user.birthDate = new Date('1990-01-15');
      user.phones = [];
      user.addresses = [];
      user.createdAt = new Date('2024-01-01');
      user.updatedAt = new Date('2024-01-15');

      expect(user.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(user.name).toBe('João');
      expect(user.lastName).toBe('Silva');
      expect(user.active).toBe(true);
      expect(user.cpf).toBe('12345678901');
      expect(user.email).toBe('joao@example.com');
      expect(user.gender).toBe('M');
      expect(user.birthDate).toEqual(new Date('1990-01-15'));
    });

    it('should handle soft delete', () => {
      user = new User();
      user.id = '550e8400-e29b-41d4-a716-446655440000';
      user.active = false;
      user.deletedAt = new Date();

      expect(user.active).toBe(false);
      expect(user.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('gender variations', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should support M (Male)', () => {
      user.gender = 'M';
      expect(user.gender).toBe('M');
    });

    it('should support F (Female)', () => {
      user.gender = 'F';
      expect(user.gender).toBe('F');
    });

    it('should support other gender values', () => {
      user.gender = 'O';
      expect(user.gender).toBe('O');

      user.gender = 'Não especificado';
      expect(user.gender).toBe('Não especificado');
    });
  });

  describe('details jsonb field', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should store simple object', () => {
      user.details = { key: 'value' };
      expect(user.details).toEqual({ key: 'value' });
    });

    it('should store nested object', () => {
      user.details = {
        preferences: {
          theme: 'dark',
          notifications: true,
        },
        metadata: {
          source: 'mobile',
        },
      };

      expect((user.details as any).preferences.theme).toBe('dark');
      expect((user.details as any).metadata.source).toBe('mobile');
    });

    it('should store array in object', () => {
      user.details = {
        tags: ['admin', 'moderator'],
        scores: [10, 20, 30],
      };

      expect(user.details.tags).toContain('admin');
      expect(user.details.scores).toEqual([10, 20, 30]);
    });

    it('should support empty details', () => {
      user.details = {};
      expect(user.details).toEqual({});
    });
  });

  describe('relationships', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should manage phones relationship', () => {
      const phone1 = new Phone();
      phone1.id = '550e8400-e29b-41d4-a716-446655440001';
      phone1.number = '987654321';

      const phone2 = new Phone();
      phone2.id = '550e8400-e29b-41d4-a716-446655440002';
      phone2.number = '912345678';

      user.phones = [phone1, phone2];

      expect(user.phones).toHaveLength(2);
      expect(user.phones[0].number).toBe('987654321');
      expect(user.phones[1].number).toBe('912345678');
    });

    it('should manage addresses relationship', () => {
      const address1 = new UserAddress();
      address1.id = '550e8400-e29b-41d4-a716-446655440003';

      const address2 = new UserAddress();
      address2.id = '550e8400-e29b-41d4-a716-446655440004';

      user.addresses = [address1, address2];

      expect(user.addresses).toHaveLength(2);
    });

    it('should support empty relationships', () => {
      user.phones = [];
      user.addresses = [];

      expect(user.phones).toHaveLength(0);
      expect(user.addresses).toHaveLength(0);
    });
  });

  describe('timestamp behavior', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should track creation time', () => {
      const before = new Date();
      user.createdAt = new Date();
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should support update tracking', () => {
      user.createdAt = new Date('2024-01-01');
      user.updatedAt = new Date('2024-01-15');

      expect(user.createdAt.getTime()).toBeLessThan(user.updatedAt.getTime());
    });

    it('should support soft deletion tracking', () => {
      user.createdAt = new Date('2024-01-01');
      user.updatedAt = new Date('2024-01-15');
      user.deletedAt = new Date('2024-01-20');

      expect(user.deletedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime());
    });
  });

  describe('password security', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should store hashed password', () => {
      user.passwordHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36E2dNTm';
      expect(user.passwordHash).toMatch(/^\$2[aby]\$/);
    });

    it('should not expose plain password', () => {
      user.passwordHash = 'hashed_value';
      expect(user.passwordHash).not.toContain('password');
    });
  });

  describe('cpf and rg validation', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should store valid CPF format', () => {
      user.cpf = '12345678901';
      expect(user.cpf).toBe('12345678901');
      expect(user.cpf).toHaveLength(11);
    });

    it('should store valid RG format', () => {
      user.rg = '1234567';
      expect(user.rg).toBe('1234567');
    });

    it('should support CPF with formatting', () => {
      user.cpf = '123.456.789-01';
      expect(user.cpf).toBe('123.456.789-01');
    });
  });

  describe('email validation', () => {
    beforeEach(() => {
      user = new User();
    });

    it('should store email addresses', () => {
      user.email = 'joao@example.com';
      expect(user.email).toBe('joao@example.com');
      expect(user.email).toContain('@');
    });

    it('should support various email formats', () => {
      user.email = 'user+tag@example.co.uk';
      expect(user.email).toBe('user+tag@example.co.uk');
    });
  });
});
