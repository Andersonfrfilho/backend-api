import { describe, expect, it } from '@jest/globals';

import {
  BenchmarkNanoidEntity,
  BenchmarkSnowflakeEntity,
  BenchmarkUUIDv4Entity,
  BenchmarkUUIDv7Entity,
} from './benchmark.entities';

describe('Benchmark Entities', () => {
  describe('BenchmarkUUIDv7Entity', () => {
    it('should create an instance with all properties', () => {
      const entity = new BenchmarkUUIDv7Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440000';
      entity.name = 'Test User';
      entity.email = 'test@example.com';
      entity.age = 30;
      entity.city = 'São Paulo';
      entity.data = { custom: 'data' };
      entity.created_at = new Date();
      entity.updated_at = new Date();

      expect(entity.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(entity.name).toBe('Test User');
      expect(entity.email).toBe('test@example.com');
      expect(entity.age).toBe(30);
      expect(entity.city).toBe('São Paulo');
      expect(entity.data).toEqual({ custom: 'data' });
      expect(entity.created_at).toBeInstanceOf(Date);
      expect(entity.updated_at).toBeInstanceOf(Date);
    });

    it('should allow undefined data and updated_at', () => {
      const entity = new BenchmarkUUIDv7Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440000';
      entity.name = 'Test User';
      entity.email = 'test@example.com';
      entity.age = 30;
      entity.city = 'São Paulo';
      entity.created_at = new Date();

      expect(entity.data).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
    });

    it('should have correct property types', () => {
      const entity = new BenchmarkUUIDv7Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440000';
      entity.name = 'Test';
      entity.email = 'test@example.com';
      entity.age = 25;
      entity.city = 'Rio';
      entity.created_at = new Date();

      expect(typeof entity.id).toBe('string');
      expect(typeof entity.name).toBe('string');
      expect(typeof entity.email).toBe('string');
      expect(typeof entity.age).toBe('number');
      expect(typeof entity.city).toBe('string');
      expect(entity.created_at instanceof Date).toBe(true);
    });
  });

  describe('BenchmarkUUIDv4Entity', () => {
    it('should create an instance with all properties', () => {
      const entity = new BenchmarkUUIDv4Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440001';
      entity.name = 'Test User V4';
      entity.email = 'testv4@example.com';
      entity.age = 25;
      entity.city = 'Rio de Janeiro';
      entity.data = { version: 4 };
      entity.created_at = new Date();
      entity.updated_at = new Date();

      expect(entity.id).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(entity.name).toBe('Test User V4');
      expect(entity.email).toBe('testv4@example.com');
      expect(entity.age).toBe(25);
      expect(entity.city).toBe('Rio de Janeiro');
      expect(entity.data).toEqual({ version: 4 });
    });

    it('should have uuid column type support', () => {
      const entity = new BenchmarkUUIDv4Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440001';
      entity.name = 'UUID V4 Test';
      entity.email = 'uuid4@example.com';
      entity.age = 30;
      entity.city = 'Brasília';
      entity.created_at = new Date();

      // Should support UUID v4 format
      expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe('BenchmarkNanoidEntity', () => {
    it('should create an instance with all properties', () => {
      const entity = new BenchmarkNanoidEntity();
      entity.id = 'V1StGXR_Z5j0d9h8';
      entity.name = 'Test User Nanoid';
      entity.email = 'nanoid@example.com';
      entity.age = 35;
      entity.city = 'Salvador';
      entity.data = { idType: 'nanoid' };
      entity.created_at = new Date();
      entity.updated_at = new Date();

      expect(entity.id).toBe('V1StGXR_Z5j0d9h8');
      expect(entity.name).toBe('Test User Nanoid');
      expect(entity.email).toBe('nanoid@example.com');
      expect(entity.age).toBe(35);
      expect(entity.city).toBe('Salvador');
      expect(entity.data).toEqual({ idType: 'nanoid' });
    });

    it('should support 21-character nanoid format', () => {
      const entity = new BenchmarkNanoidEntity();
      entity.id = 'V1StGXR_Z5j0d9h8Abc1'; // 21 characters
      entity.name = 'Nanoid Test';
      entity.email = 'nanoid21@example.com';
      entity.age = 28;
      entity.city = 'Curitiba';
      entity.created_at = new Date();

      expect(entity.id.length).toBeLessThanOrEqual(21);
      expect(/^[A-Za-z0-9_-]+$/.test(entity.id)).toBe(true);
    });

    it('should allow undefined optional fields', () => {
      const entity = new BenchmarkNanoidEntity();
      entity.id = 'testnanoid123456789a';
      entity.name = 'Basic Nanoid';
      entity.email = 'basic@example.com';
      entity.age = 40;
      entity.city = 'Porto Alegre';
      entity.created_at = new Date();

      expect(entity.data).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
    });
  });

  describe('BenchmarkSnowflakeEntity', () => {
    it('should create an instance with all properties', () => {
      const entity = new BenchmarkSnowflakeEntity();
      entity.id = '123456789012345678';
      entity.name = 'Test User Snowflake';
      entity.email = 'snowflake@example.com';
      entity.age = 32;
      entity.city = 'Manaus';
      entity.data = { idType: 'snowflake', timestamp: Date.now() };
      entity.created_at = new Date();
      entity.updated_at = new Date();

      expect(entity.id).toBe('123456789012345678');
      expect(entity.name).toBe('Test User Snowflake');
      expect(entity.email).toBe('snowflake@example.com');
      expect(entity.age).toBe(32);
      expect(entity.city).toBe('Manaus');
      expect(entity.data).toHaveProperty('idType', 'snowflake');
    });

    it('should handle bigint snowflake IDs as strings', () => {
      const entity = new BenchmarkSnowflakeEntity();
      entity.id = '9223372036854775807'; // Max 64-bit integer
      entity.name = 'Snowflake Max';
      entity.email = 'max@example.com';
      entity.age = 45;
      entity.city = 'Recife';
      entity.created_at = new Date();

      expect(typeof entity.id).toBe('string');
      expect(/^\d+$/.test(entity.id)).toBe(true);
    });

    it('should preserve precision with string ID storage', () => {
      const entity = new BenchmarkSnowflakeEntity();
      const largeId = '9223372036854775806';
      entity.id = largeId;
      entity.name = 'Precision Test';
      entity.email = 'precision@example.com';
      entity.age = 50;
      entity.city = 'Fortaleza';
      entity.created_at = new Date();

      expect(entity.id).toBe(largeId);
      expect(BigInt(entity.id).toString()).toBe(largeId);
    });

    it('should allow undefined optional fields', () => {
      const entity = new BenchmarkSnowflakeEntity();
      entity.id = '111222333444555666';
      entity.name = 'Basic Snowflake';
      entity.email = 'basic-snowflake@example.com';
      entity.age = 27;
      entity.city = 'Belém';
      entity.created_at = new Date();

      expect(entity.data).toBeUndefined();
      expect(entity.updated_at).toBeUndefined();
    });
  });

  describe('Entity Comparison', () => {
    it('should have same structure across all entities', () => {
      const v7 = new BenchmarkUUIDv7Entity();
      const v4 = new BenchmarkUUIDv4Entity();
      const nanoid = new BenchmarkNanoidEntity();
      const snowflake = new BenchmarkSnowflakeEntity();

      // All should have these properties
      expect(Object.getOwnPropertyNames(v7)).toContain('name');
      expect(Object.getOwnPropertyNames(v4)).toContain('name');
      expect(Object.getOwnPropertyNames(nanoid)).toContain('name');
      expect(Object.getOwnPropertyNames(snowflake)).toContain('name');

      expect(Object.getOwnPropertyNames(v7)).toContain('email');
      expect(Object.getOwnPropertyNames(v4)).toContain('email');
      expect(Object.getOwnPropertyNames(nanoid)).toContain('email');
      expect(Object.getOwnPropertyNames(snowflake)).toContain('email');

      expect(Object.getOwnPropertyNames(v7)).toContain('age');
      expect(Object.getOwnPropertyNames(v4)).toContain('age');
      expect(Object.getOwnPropertyNames(nanoid)).toContain('age');
      expect(Object.getOwnPropertyNames(snowflake)).toContain('age');

      expect(Object.getOwnPropertyNames(v7)).toContain('city');
      expect(Object.getOwnPropertyNames(v4)).toContain('city');
      expect(Object.getOwnPropertyNames(nanoid)).toContain('city');
      expect(Object.getOwnPropertyNames(snowflake)).toContain('city');

      expect(Object.getOwnPropertyNames(v7)).toContain('created_at');
      expect(Object.getOwnPropertyNames(v4)).toContain('created_at');
      expect(Object.getOwnPropertyNames(nanoid)).toContain('created_at');
      expect(Object.getOwnPropertyNames(snowflake)).toContain('created_at');
    });

    it('should differ only in ID column type', () => {
      const v7 = new BenchmarkUUIDv7Entity();
      const nanoid = new BenchmarkNanoidEntity();
      const snowflake = new BenchmarkSnowflakeEntity();

      // All have id property
      v7.id = '550e8400-e29b-41d4-a716-446655440000';
      nanoid.id = 'V1StGXR_Z5j0d9h8';
      snowflake.id = '123456789012345678';

      // But different types/formats
      expect(typeof v7.id).toBe('string');
      expect(typeof nanoid.id).toBe('string');
      expect(typeof snowflake.id).toBe('string');

      expect(v7.id).toMatch(/^[0-9a-f-]+$/i); // UUID
      expect(nanoid.id).toMatch(/^[A-Za-z0-9_-]+$/); // Nanoid
      expect(/^\d+$/.test(snowflake.id)).toBe(true); // Numeric
    });
  });

  describe('Data Serialization', () => {
    it('should handle JSON data correctly', () => {
      const entity = new BenchmarkUUIDv7Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440000';
      entity.name = 'JSON Test';
      entity.email = 'json@example.com';
      entity.age = 30;
      entity.city = 'São Paulo';
      entity.data = {
        nested: {
          deep: {
            value: 'test',
          },
        },
        array: [1, 2, 3],
      };
      entity.created_at = new Date();

      expect(entity.data.nested.deep.value).toBe('test');
      expect(entity.data.array).toEqual([1, 2, 3]);
    });

    it('should handle empty data object', () => {
      const entity = new BenchmarkUUIDv4Entity();
      entity.id = '550e8400-e29b-41d4-a716-446655440001';
      entity.name = 'Empty Data';
      entity.email = 'empty@example.com';
      entity.age = 25;
      entity.city = 'Rio';
      entity.data = {};
      entity.created_at = new Date();

      expect(entity.data).toEqual({});
      expect(Object.keys(entity.data).length).toBe(0);
    });

    it('should handle null/undefined dates', () => {
      const entity = new BenchmarkNanoidEntity();
      entity.id = 'testnano123456789ab';
      entity.name = 'Null Date Test';
      entity.email = 'null-date@example.com';
      entity.age = 28;
      entity.city = 'Brasília';
      entity.created_at = new Date();
      entity.updated_at = null as any;

      expect(entity.created_at).toBeInstanceOf(Date);
      expect(entity.updated_at).toBeNull();
    });
  });
});
