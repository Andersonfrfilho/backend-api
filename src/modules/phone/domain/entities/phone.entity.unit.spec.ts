import { describe, expect, it } from '@jest/globals';
import { Phone } from './phone.entity';

describe('Phone Entity - Unit Tests', () => {
  describe('Phone constructor', () => {
    it('should create a Phone entity instance', () => {
      const phone = new Phone();

      expect(phone).toBeDefined();
      expect(phone).toBeInstanceOf(Phone);
    });

    it('should have all required properties defined after instantiation', () => {
      const phone = new Phone();

      expect(phone).toHaveProperty('id');
      expect(phone).toHaveProperty('country');
      expect(phone).toHaveProperty('area');
      expect(phone).toHaveProperty('number');
      expect(phone).toHaveProperty('userId');
      expect(phone).toHaveProperty('user');
      expect(phone).toHaveProperty('createdAt');
      expect(phone).toHaveProperty('updatedAt');
      expect(phone).toHaveProperty('deletedAt');
    });
  });

  describe('Phone properties assignment', () => {
    it('should assign country property correctly', () => {
      const phone = new Phone();
      phone.country = '+55';

      expect(phone.country).toBe('+55');
      expect(typeof phone.country).toBe('string');
    });

    it('should assign area code property correctly', () => {
      const phone = new Phone();
      phone.area = '85';

      expect(phone.area).toBe('85');
      expect(typeof phone.area).toBe('string');
    });

    it('should assign phone number property correctly', () => {
      const phone = new Phone();
      phone.number = '993056772';

      expect(phone.number).toBe('993056772');
      expect(typeof phone.number).toBe('string');
    });

    it('should assign userId property correctly', () => {
      const phone = new Phone();
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      phone.userId = userId;

      expect(phone.userId).toBe(userId);
      expect(typeof phone.userId).toBe('string');
    });
  });

  describe('Phone entity full lifecycle', () => {
    it('should create a complete phone object with all fields', () => {
      const phone = new Phone();
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const now = new Date();

      phone.id = '660e8400-e29b-41d4-a716-446655440001';
      phone.country = '+55';
      phone.area = '85';
      phone.number = '993056772';
      phone.userId = userId;
      phone.createdAt = now;
      phone.updatedAt = null;
      phone.deletedAt = null;

      expect(phone.id).toBe('660e8400-e29b-41d4-a716-446655440001');
      expect(phone.country).toBe('+55');
      expect(phone.area).toBe('85');
      expect(phone.number).toBe('993056772');
      expect(phone.userId).toBe(userId);
      expect(phone.createdAt).toEqual(now);
      expect(phone.updatedAt).toBeNull();
      expect(phone.deletedAt).toBeNull();
    });

    it('should handle soft delete with deletedAt timestamp', () => {
      const phone = new Phone();
      const deletedTime = new Date();

      phone.deletedAt = deletedTime;

      expect(phone.deletedAt).toEqual(deletedTime);
      expect(phone.deletedAt).not.toBeNull();
    });

    it('should update timestamp on update', () => {
      const phone = new Phone();
      const createdTime = new Date('2025-01-01T00:00:00Z');
      const updatedTime = new Date('2025-01-02T00:00:00Z');

      phone.createdAt = createdTime;
      phone.updatedAt = updatedTime;

      expect(phone.createdAt).toEqual(createdTime);
      expect(phone.updatedAt).toEqual(updatedTime);
      expect(phone.updatedAt).not.toEqual(phone.createdAt);
    });
  });

  describe('Phone Brazilian format', () => {
    it('should handle valid Brazilian phone format', () => {
      const phone = new Phone();

      phone.country = '+55';
      phone.area = '85';
      phone.number = '993056772';

      const brazilianFormat = `${phone.country}${phone.area}${phone.number}`;

      expect(brazilianFormat).toBe('+5585993056772');
    });

    it('should accept different area codes', () => {
      const phone1 = new Phone();
      const phone2 = new Phone();

      phone1.area = '11'; // São Paulo
      phone2.area = '21'; // Rio de Janeiro

      expect(phone1.area).toBe('11');
      expect(phone2.area).toBe('21');
      expect(phone1.area).not.toBe(phone2.area);
    });

    it('should accept different country codes', () => {
      const phone1 = new Phone();
      const phone2 = new Phone();

      phone1.country = '+55';
      phone2.country = '+1';

      expect(phone1.country).toBe('+55');
      expect(phone2.country).toBe('+1');
    });
  });

  describe('Phone relationship management', () => {
    it('should have user relationship property', () => {
      const phone = new Phone();

      expect(phone).toHaveProperty('user');
    });

    it('should correlate userId with user relationship', () => {
      const phone = new Phone();
      const userId = '550e8400-e29b-41d4-a716-446655440000';

      phone.userId = userId;

      expect(phone.userId).toBe(userId);
      expect(phone).toHaveProperty('user');
    });
  });
});
