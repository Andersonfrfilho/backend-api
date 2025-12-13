import { beforeEach, describe, expect, it } from '@jest/globals';

import { Phone } from './phone.entity';

describe('Phone Entity', () => {
  let phone: Phone;

  it('should create an instance', () => {
    phone = new Phone();
    expect(phone).toBeInstanceOf(Phone);
  });

  describe('properties', () => {
    beforeEach(() => {
      phone = new Phone();
    });

    it('should have id property', () => {
      phone.id = '550e8400-e29b-41d4-a716-446655440000';
      expect(phone.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should have country property', () => {
      phone.country = '+55';
      expect(phone.country).toBe('+55');
    });

    it('should have area property', () => {
      phone.area = '11';
      expect(phone.area).toBe('11');
    });

    it('should have number property', () => {
      phone.number = '987654321';
      expect(phone.number).toBe('987654321');
    });

    it('should have userId property', () => {
      phone.userId = '550e8400-e29b-41d4-a716-446655440001';
      expect(phone.userId).toBe('550e8400-e29b-41d4-a716-446655440001');
    });

    it('should have createdAt property', () => {
      const now = new Date();
      phone.createdAt = now;
      expect(phone.createdAt).toEqual(now);
    });

    it('should have updatedAt property', () => {
      const now = new Date();
      phone.updatedAt = now;
      expect(phone.updatedAt).toEqual(now);
    });

    it('should allow null updatedAt', () => {
      phone.updatedAt = null;
      expect(phone.updatedAt).toBeNull();
    });

    it('should have deletedAt property', () => {
      const now = new Date();
      phone.deletedAt = now;
      expect(phone.deletedAt).toEqual(now);
    });

    it('should allow null deletedAt', () => {
      phone.deletedAt = null;
      expect(phone.deletedAt).toBeNull();
    });
  });

  describe('full phone scenario', () => {
    it('should create complete phone with all properties', () => {
      phone = new Phone();
      phone.id = '550e8400-e29b-41d4-a716-446655440000';
      phone.country = '+55';
      phone.area = '11';
      phone.number = '987654321';
      phone.userId = '550e8400-e29b-41d4-a716-446655440001';
      phone.createdAt = new Date('2024-01-01');
      phone.updatedAt = new Date('2024-01-15');

      expect(phone.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(phone.country).toBe('+55');
      expect(phone.area).toBe('11');
      expect(phone.number).toBe('987654321');
      expect(phone.userId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(phone.createdAt).toEqual(new Date('2024-01-01'));
      expect(phone.updatedAt).toEqual(new Date('2024-01-15'));
    });

    it('should handle soft delete', () => {
      phone = new Phone();
      phone.id = '550e8400-e29b-41d4-a716-446655440000';
      phone.country = '+55';
      phone.area = '11';
      phone.number = '987654321';
      phone.deletedAt = new Date();

      expect(phone.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('phone format variations', () => {
    beforeEach(() => {
      phone = new Phone();
    });

    it('should support different country codes', () => {
      phone.country = '+1'; // USA
      expect(phone.country).toBe('+1');

      phone.country = '+44'; // UK
      expect(phone.country).toBe('+44');

      phone.country = '+55'; // Brazil
      expect(phone.country).toBe('+55');
    });

    it('should support different area codes', () => {
      phone.area = '11'; // São Paulo
      expect(phone.area).toBe('11');

      phone.area = '21'; // Rio de Janeiro
      expect(phone.area).toBe('21');

      phone.area = '31'; // Belo Horizonte
      expect(phone.area).toBe('31');
    });

    it('should support various number formats', () => {
      phone.number = '987654321';
      expect(phone.number).toBe('987654321');

      phone.number = '3333-1234';
      expect(phone.number).toBe('3333-1234');

      phone.number = '98765-4321';
      expect(phone.number).toBe('98765-4321');
    });
  });

  describe('timestamp behavior', () => {
    beforeEach(() => {
      phone = new Phone();
    });

    it('should track creation time', () => {
      const before = new Date();
      phone.createdAt = new Date();
      const after = new Date();

      expect(phone.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(phone.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should support update tracking', () => {
      phone.createdAt = new Date('2024-01-01');
      phone.updatedAt = new Date('2024-01-15');

      expect(phone.createdAt.getTime()).toBeLessThan(phone.updatedAt.getTime());
    });

    it('should support soft deletion tracking', () => {
      phone.createdAt = new Date('2024-01-01');
      phone.updatedAt = new Date('2024-01-15');
      phone.deletedAt = new Date('2024-01-20');

      expect(phone.deletedAt.getTime()).toBeGreaterThan(phone.updatedAt.getTime());
    });
  });
});
