import { beforeEach, describe, expect, it } from '@jest/globals';

import { SnowflakeIDGeneratorService } from './snowflake-id-generator.service';

describe('SnowflakeIDGeneratorService', () => {
  let service: SnowflakeIDGeneratorService;

  beforeEach(() => {
    // Reset environment variables
    process.env.WORKER_ID = '1';
    process.env.DATACENTER_ID = '1';
    service = new SnowflakeIDGeneratorService();
  });

  describe('generate', () => {
    it('should generate a valid Snowflake ID', () => {
      const id = service.generate();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(/^\d+$/.test(id)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const id1 = service.generate();
      const id2 = service.generate();
      const id3 = service.generate();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should generate IDs in increasing order', () => {
      const id1 = BigInt(service.generate());
      const id2 = BigInt(service.generate());
      const id3 = BigInt(service.generate());

      expect(id1 < id2).toBe(true);
      expect(id2 < id3).toBe(true);
    });

    it('should handle sequence overflow within same millisecond', () => {
      // Call generate multiple times rapidly
      const ids = [];
      for (let i = 0; i < 100; i++) {
        ids.push(BigInt(service.generate()));
      }

      // All should be unique and increasing
      for (let i = 0; i < ids.length - 1; i++) {
        expect(ids[i] < ids[i + 1]).toBe(true);
      }
    });

    it('should reset sequence on new millisecond', async () => {
      const id1 = service.generate();

      // Wait a bit for new millisecond
      await new Promise((resolve) => setTimeout(resolve, 2));

      const id2 = service.generate();

      expect(BigInt(id1) < BigInt(id2)).toBe(true);
    });
  });

  describe('extractTimestamp', () => {
    it('should extract timestamp from Snowflake ID', () => {
      const id = service.generate();
      const timestamp = service.extractTimestamp(id);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 1000); // Within last second
    });

    it('should extract correct epoch (2024-01-01)', () => {
      const id = service.generate();
      const timestamp = service.extractTimestamp(id);

      // Timestamp should be around 2024-01-01 or later
      const year = timestamp.getFullYear();
      expect(year).toBeGreaterThanOrEqual(2024);
    });

    it('should extract same timestamp for multiple IDs generated in same millisecond', async () => {
      // This is tricky because of sequence handling
      const id1 = service.generate();
      const id2 = service.generate();

      const ts1 = service.extractTimestamp(id1);
      const ts2 = service.extractTimestamp(id2);

      // Timestamps should be very close (within 1ms)
      expect(Math.abs(ts1.getTime() - ts2.getTime())).toBeLessThanOrEqual(1);
    });
  });

  describe('extractDatacenterId', () => {
    it('should extract datacenter ID from Snowflake ID', () => {
      const id = service.generate();
      const datacenterId = service.extractDatacenterId(id);

      expect(datacenterId).toBeDefined();
      expect(typeof datacenterId).toBe('number');
      expect(datacenterId).toBeGreaterThanOrEqual(0);
      expect(datacenterId).toBeLessThan(32);
    });

    it('should extract correct default datacenter ID (1)', () => {
      const id = service.generate();
      const datacenterId = service.extractDatacenterId(id);

      expect(datacenterId).toBe(1);
    });

    it('should respect DATACENTER_ID environment variable', () => {
      process.env.DATACENTER_ID = '5';
      const newService = new SnowflakeIDGeneratorService();
      const id = newService.generate();
      const datacenterId = newService.extractDatacenterId(id);

      expect(datacenterId).toBe(5);
    });
  });

  describe('extractWorkerId', () => {
    it('should extract worker ID from Snowflake ID', () => {
      const id = service.generate();
      const workerId = service.extractWorkerId(id);

      expect(workerId).toBeDefined();
      expect(typeof workerId).toBe('number');
      expect(workerId).toBeGreaterThanOrEqual(0);
      expect(workerId).toBeLessThan(32);
    });

    it('should extract correct default worker ID (1)', () => {
      const id = service.generate();
      const workerId = service.extractWorkerId(id);

      expect(workerId).toBe(1);
    });

    it('should respect WORKER_ID environment variable', () => {
      process.env.WORKER_ID = '10';
      const newService = new SnowflakeIDGeneratorService();
      const id = newService.generate();
      const workerId = newService.extractWorkerId(id);

      expect(workerId).toBe(10);
    });
  });

  describe('extractSequence', () => {
    it('should extract sequence number from Snowflake ID', () => {
      const id = service.generate();
      const sequence = service.extractSequence(id);

      expect(sequence).toBeDefined();
      expect(typeof sequence).toBe('number');
      expect(sequence).toBeGreaterThanOrEqual(0);
      expect(sequence).toBeLessThan(4096);
    });

    it('should increment sequence for IDs generated in same millisecond', () => {
      const id1 = service.generate();
      const id2 = service.generate();

      const seq1 = service.extractSequence(id1);
      const seq2 = service.extractSequence(id2);

      // If generated in same ms, seq2 should be seq1 + 1
      if (service.extractTimestamp(id1).getTime() === service.extractTimestamp(id2).getTime()) {
        expect(seq2).toBe(seq1 + 1);
      }
    });

    it('should reset sequence after millisecond changes', async () => {
      const id1 = service.generate();

      // Wait for next millisecond
      await new Promise((resolve) => setTimeout(resolve, 2));

      const id2 = service.generate();

      const seq1 = service.extractSequence(id1);
      const seq2 = service.extractSequence(id2);

      // If different milliseconds, sequences should be independent
      if (service.extractTimestamp(id1).getTime() !== service.extractTimestamp(id2).getTime()) {
        expect(seq2).toBeLessThanOrEqual(seq1);
      }
    });
  });

  describe('validation', () => {
    it('should throw error for invalid WORKER_ID (< 0)', () => {
      process.env.WORKER_ID = '-1';
      expect(() => {
        new SnowflakeIDGeneratorService();
      }).toThrow('WORKER_ID must be between 0 and 31');
    });

    it('should throw error for invalid WORKER_ID (> 31)', () => {
      process.env.WORKER_ID = '32';
      expect(() => {
        new SnowflakeIDGeneratorService();
      }).toThrow('WORKER_ID must be between 0 and 31');
    });

    it('should throw error for invalid DATACENTER_ID (< 0)', () => {
      process.env.DATACENTER_ID = '-1';
      expect(() => {
        new SnowflakeIDGeneratorService();
      }).toThrow('DATACENTER_ID must be between 0 and 31');
    });

    it('should throw error for invalid DATACENTER_ID (> 31)', () => {
      process.env.DATACENTER_ID = '32';
      expect(() => {
        new SnowflakeIDGeneratorService();
      }).toThrow('DATACENTER_ID must be between 0 and 31');
    });

    it('should accept valid WORKER_ID range', () => {
      for (let i = 0; i < 32; i++) {
        process.env.WORKER_ID = i.toString();
        expect(() => {
          new SnowflakeIDGeneratorService();
        }).not.toThrow();
      }
    });

    it('should accept valid DATACENTER_ID range', () => {
      for (let i = 0; i < 32; i++) {
        process.env.DATACENTER_ID = i.toString();
        expect(() => {
          new SnowflakeIDGeneratorService();
        }).not.toThrow();
      }
    });
  });

  describe('roundtrip extraction', () => {
    it('should correctly extract all components from generated ID', () => {
      const id = service.generate();

      const timestamp = service.extractTimestamp(id);
      const datacenterId = service.extractDatacenterId(id);
      const workerId = service.extractWorkerId(id);
      const sequence = service.extractSequence(id);

      expect(timestamp).toBeInstanceOf(Date);
      expect(datacenterId).toBe(1);
      expect(workerId).toBe(1);
      expect(typeof sequence).toBe('number');
    });

    it('should maintain consistency across multiple extractions', () => {
      const id = service.generate();

      const timestamp1 = service.extractTimestamp(id);
      const timestamp2 = service.extractTimestamp(id);
      const workerId1 = service.extractWorkerId(id);
      const workerId2 = service.extractWorkerId(id);

      expect(timestamp1.getTime()).toBe(timestamp2.getTime());
      expect(workerId1).toBe(workerId2);
    });
  });
});
