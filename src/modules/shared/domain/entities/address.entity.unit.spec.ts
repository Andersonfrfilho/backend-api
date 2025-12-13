import { describe, expect, it } from '@jest/globals';

import { Address } from './address.entity';

describe('Address Entity', () => {
  let address: Address;

  it('should create an instance', () => {
    address = new Address();
    expect(address).toBeInstanceOf(Address);
  });

  describe('properties', () => {
    beforeEach(() => {
      address = new Address();
    });

    it('should have id property', () => {
      address.id = '550e8400-e29b-41d4-a716-446655440000';
      expect(address.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should have street property', () => {
      address.street = 'Rua das Flores';
      expect(address.street).toBe('Rua das Flores');
    });

    it('should have number property', () => {
      address.number = '123';
      expect(address.number).toBe('123');
    });

    it('should have complement property', () => {
      address.complement = 'Apto 45';
      expect(address.complement).toBe('Apto 45');
    });

    it('should have default complement value', () => {
      expect(address.complement).toBeUndefined();
    });

    it('should have neighborhood property', () => {
      address.neighborhood = 'Centro';
      expect(address.neighborhood).toBe('Centro');
    });

    it('should have city property', () => {
      address.city = 'São Paulo';
      expect(address.city).toBe('São Paulo');
    });

    it('should have state property', () => {
      address.state = 'SP';
      expect(address.state).toBe('SP');
    });

    it('should have zipCode property', () => {
      address.zipCode = '01310-100';
      expect(address.zipCode).toBe('01310-100');
    });

    it('should have country property with default BR', () => {
      expect(address.country).toBeUndefined();
      address.country = 'BR';
      expect(address.country).toBe('BR');
    });

    it('should have latitude property', () => {
      address.latitude = -23.5505;
      expect(address.latitude).toBe(-23.5505);
    });

    it('should have longitude property', () => {
      address.longitude = -46.6333;
      expect(address.longitude).toBe(-46.6333);
    });

    it('should have active property with default true', () => {
      expect(address.active).toBeUndefined();
      address.active = true;
      expect(address.active).toBe(true);
    });

    it('should have createdAt property', () => {
      const now = new Date();
      address.createdAt = now;
      expect(address.createdAt).toEqual(now);
    });

    it('should have updatedAt property', () => {
      const now = new Date();
      address.updatedAt = now;
      expect(address.updatedAt).toEqual(now);
    });

    it('should allow null updatedAt', () => {
      address.updatedAt = null;
      expect(address.updatedAt).toBeNull();
    });

    it('should have deletedAt property', () => {
      const now = new Date();
      address.deletedAt = now;
      expect(address.deletedAt).toEqual(now);
    });

    it('should allow null deletedAt', () => {
      address.deletedAt = null;
      expect(address.deletedAt).toBeNull();
    });
  });

  describe('full address scenario', () => {
    it('should create complete address with all properties', () => {
      address = new Address();
      address.id = '550e8400-e29b-41d4-a716-446655440000';
      address.street = 'Avenida Paulista';
      address.number = '1000';
      address.complement = 'Sala 30';
      address.neighborhood = 'Bela Vista';
      address.city = 'São Paulo';
      address.state = 'SP';
      address.zipCode = '01311-100';
      address.country = 'BR';
      address.latitude = -23.5613;
      address.longitude = -46.656;
      address.active = true;
      address.createdAt = new Date('2024-01-01');
      address.updatedAt = new Date('2024-01-15');

      expect(address.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(address.street).toBe('Avenida Paulista');
      expect(address.number).toBe('1000');
      expect(address.complement).toBe('Sala 30');
      expect(address.neighborhood).toBe('Bela Vista');
      expect(address.city).toBe('São Paulo');
      expect(address.state).toBe('SP');
      expect(address.zipCode).toBe('01311-100');
      expect(address.country).toBe('BR');
      expect(address.latitude).toBe(-23.5613);
      expect(address.longitude).toBe(-46.656);
      expect(address.active).toBe(true);
    });

    it('should handle soft delete', () => {
      address = new Address();
      address.id = '550e8400-e29b-41d4-a716-446655440000';
      address.active = false;
      address.deletedAt = new Date();

      expect(address.active).toBe(false);
      expect(address.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('coordinates validation', () => {
    beforeEach(() => {
      address = new Address();
    });

    it('should accept valid latitude values', () => {
      address.latitude = 0;
      expect(address.latitude).toBe(0);

      address.latitude = -90;
      expect(address.latitude).toBe(-90);

      address.latitude = 90;
      expect(address.latitude).toBe(90);

      address.latitude = -23.5505;
      expect(address.latitude).toBe(-23.5505);
    });

    it('should accept valid longitude values', () => {
      address.longitude = 0;
      expect(address.longitude).toBe(0);

      address.longitude = -180;
      expect(address.longitude).toBe(-180);

      address.longitude = 180;
      expect(address.longitude).toBe(180);

      address.longitude = -46.6333;
      expect(address.longitude).toBe(-46.6333);
    });
  });

  describe('nullable fields', () => {
    beforeEach(() => {
      address = new Address();
    });

    it('should allow null coordinates', () => {
      address.latitude = null as any;
      address.longitude = null as any;

      expect(address.latitude).toBeNull();
      expect(address.longitude).toBeNull();
    });

    it('should allow null updatedAt and deletedAt', () => {
      address.updatedAt = null;
      address.deletedAt = null;

      expect(address.updatedAt).toBeNull();
      expect(address.deletedAt).toBeNull();
    });
  });
});
