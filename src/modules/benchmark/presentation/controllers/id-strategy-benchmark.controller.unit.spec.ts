import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { IDStrategyBenchmarkService } from '../../application/services/id-strategy-benchmark.service';
import { IDStrategyBenchmarkController } from './id-strategy-benchmark.controller';

describe('IDStrategyBenchmarkController', () => {
  let controller: IDStrategyBenchmarkController;
  let service: jest.Mocked<IDStrategyBenchmarkService>;

  beforeEach(() => {
    service = {
      benchmarkInsert: jest.fn(),
      benchmarkSelect: jest.fn(),
      benchmarkUpdate: jest.fn(),
      benchmarkIndexSearch: jest.fn(),
      benchmarkDiskUsage: jest.fn(),
      benchmarkAll: jest.fn(),
      cleanupAll: jest.fn(),
    } as any;

    controller = new IDStrategyBenchmarkController(service);

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('testInsert', () => {
    it('should call benchmarkInsert with provided count', async () => {
      const mockResult = {
        uuidV7: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        uuidV4: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        nanoid: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        snowflake: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
      };
      service.benchmarkInsert.mockResolvedValue(mockResult);

      const result = await controller.testInsert('5000');

      expect(service.benchmarkInsert).toHaveBeenCalledWith(5000);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winner');
    });

    it('should use default count of 10000 when not provided', async () => {
      const mockResult = {
        uuidV7: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        uuidV4: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        nanoid: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        snowflake: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
      };
      service.benchmarkInsert.mockResolvedValue(mockResult);

      await controller.testInsert();

      expect(service.benchmarkInsert).toHaveBeenCalledWith(10000);
    });

    it('should identify fastest strategy', async () => {
      const mockResult = {
        uuidV7: { duration: 100, recordsPerSecond: 1000, avgTimePerRecord: 0.1 },
        uuidV4: { duration: 150, recordsPerSecond: 500, avgTimePerRecord: 0.2 },
        nanoid: { duration: 120, recordsPerSecond: 800, avgTimePerRecord: 0.15 },
        snowflake: { duration: 110, recordsPerSecond: 900, avgTimePerRecord: 0.12 },
      };
      service.benchmarkInsert.mockResolvedValue(mockResult);

      const result = await controller.testInsert('1000');

      expect(result.winner).toContain('uuidV7');
      expect(result.winner).toContain('1000');
    });

    it('should return proper response structure', async () => {
      const mockResult = {
        uuidV7: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        uuidV4: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        nanoid: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
        snowflake: { duration: 100, recordsPerSecond: 100, avgTimePerRecord: 1 },
      };
      service.benchmarkInsert.mockResolvedValue(mockResult);

      const result = await controller.testInsert('1000');

      expect(typeof result.message).toBe('string');
      expect(typeof result.winner).toBe('string');
      expect(result.results).toBeDefined();
    });
  });

  describe('testSelect', () => {
    it('should call benchmarkSelect with provided limit', async () => {
      const mockResult = {
        uuidV7: { duration: 50, queriesPerSecond: 200 },
        uuidV4: { duration: 60, queriesPerSecond: 166 },
        nanoid: { duration: 55, queriesPerSecond: 181 },
        snowflake: { duration: 52, queriesPerSecond: 192 },
      };
      service.benchmarkSelect.mockResolvedValue(mockResult);

      const result = await controller.testSelect('500');

      expect(service.benchmarkSelect).toHaveBeenCalledWith(500);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winner');
    });

    it('should use default limit of 1000 when not provided', async () => {
      const mockResult = {
        uuidV7: { duration: 50, queriesPerSecond: 200 },
        uuidV4: { duration: 60, queriesPerSecond: 166 },
        nanoid: { duration: 55, queriesPerSecond: 181 },
        snowflake: { duration: 52, queriesPerSecond: 192 },
      };
      service.benchmarkSelect.mockResolvedValue(mockResult);

      await controller.testSelect();

      expect(service.benchmarkSelect).toHaveBeenCalledWith(1000);
    });

    it('should identify fastest SELECT strategy', async () => {
      const mockResult = {
        uuidV7: { duration: 50, queriesPerSecond: 200 },
        uuidV4: { duration: 60, queriesPerSecond: 166 },
        nanoid: { duration: 55, queriesPerSecond: 181 },
        snowflake: { duration: 52, queriesPerSecond: 192 },
      };
      service.benchmarkSelect.mockResolvedValue(mockResult);

      const result = await controller.testSelect('1000');

      expect(result.winner).toContain('uuidV7');
    });
  });

  describe('testUpdate', () => {
    it('should call benchmarkUpdate with provided count', async () => {
      const mockResult = {
        uuidV7: { duration: 75, updatesPerSecond: 133 },
        uuidV4: { duration: 85, updatesPerSecond: 117 },
        nanoid: { duration: 80, updatesPerSecond: 125 },
        snowflake: { duration: 78, updatesPerSecond: 128 },
      };
      service.benchmarkUpdate.mockResolvedValue(mockResult);

      const result = await controller.testUpdate('500');

      expect(service.benchmarkUpdate).toHaveBeenCalledWith(500);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winner');
    });

    it('should use default count of 1000 when not provided', async () => {
      const mockResult = {
        uuidV7: { duration: 75, updatesPerSecond: 133 },
        uuidV4: { duration: 85, updatesPerSecond: 117 },
        nanoid: { duration: 80, updatesPerSecond: 125 },
        snowflake: { duration: 78, updatesPerSecond: 128 },
      };
      service.benchmarkUpdate.mockResolvedValue(mockResult);

      await controller.testUpdate();

      expect(service.benchmarkUpdate).toHaveBeenCalledWith(1000);
    });

    it('should identify fastest UPDATE strategy', async () => {
      const mockResult = {
        uuidV7: { duration: 75, updatesPerSecond: 200 },
        uuidV4: { duration: 85, updatesPerSecond: 100 },
        nanoid: { duration: 80, updatesPerSecond: 150 },
        snowflake: { duration: 78, updatesPerSecond: 128 },
      };
      service.benchmarkUpdate.mockResolvedValue(mockResult);

      const result = await controller.testUpdate('1000');

      expect(result.winner).toContain('uuidV7');
    });
  });

  describe('testIndexSearch', () => {
    it('should call benchmarkIndexSearch with provided iterations', async () => {
      const mockResult = {
        uuidV7: { duration: 30, searchesPerSecond: 333 },
        uuidV4: { duration: 35, searchesPerSecond: 285 },
        nanoid: { duration: 32, searchesPerSecond: 312 },
        snowflake: { duration: 31, searchesPerSecond: 322 },
      };
      service.benchmarkIndexSearch.mockResolvedValue(mockResult);

      const result = await controller.testIndexSearch('50');

      expect(service.benchmarkIndexSearch).toHaveBeenCalledWith(50);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winner');
    });

    it('should use default iterations of 100 when not provided', async () => {
      const mockResult = {
        uuidV7: { duration: 30, searchesPerSecond: 333 },
        uuidV4: { duration: 35, searchesPerSecond: 285 },
        nanoid: { duration: 32, searchesPerSecond: 312 },
        snowflake: { duration: 31, searchesPerSecond: 322 },
      };
      service.benchmarkIndexSearch.mockResolvedValue(mockResult);

      await controller.testIndexSearch();

      expect(service.benchmarkIndexSearch).toHaveBeenCalledWith(100);
    });

    it('should identify fastest INDEX SEARCH strategy', async () => {
      const mockResult = {
        uuidV7: { duration: 30, searchesPerSecond: 333 },
        uuidV4: { duration: 35, searchesPerSecond: 285 },
        nanoid: { duration: 32, searchesPerSecond: 312 },
        snowflake: { duration: 31, searchesPerSecond: 322 },
      };
      service.benchmarkIndexSearch.mockResolvedValue(mockResult);

      const result = await controller.testIndexSearch('100');

      expect(result.winner).toContain('uuidV7');
    });
  });

  describe('testDiskUsage', () => {
    it('should call benchmarkDiskUsage', async () => {
      const mockResult = {
        uuidV7: {
          totalSize: '50 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        uuidV4: {
          totalSize: '55 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        nanoid: {
          totalSize: '48 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        snowflake: {
          totalSize: '45 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
      };
      service.benchmarkDiskUsage.mockResolvedValue(mockResult);

      const result = await controller.testDiskUsage();

      expect(service.benchmarkDiskUsage).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('winner');
    });

    it('should identify smallest disk usage strategy', async () => {
      const mockResult = {
        uuidV7: {
          totalSize: '50 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        uuidV4: {
          totalSize: '55 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        nanoid: {
          totalSize: '48 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        snowflake: {
          totalSize: '60 MB',
          indexSize: '12 MB',
          recordCount: 100000,
          sizePerRecord: '576 bits',
        },
      };
      service.benchmarkDiskUsage.mockResolvedValue(mockResult);

      const result = await controller.testDiskUsage();

      expect(result.winner).toContain('nanoid');
    });

    it('should include size information in winner message', async () => {
      const mockResult = {
        uuidV7: {
          totalSize: '50 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        uuidV4: {
          totalSize: '55 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        nanoid: {
          totalSize: '48 MB',
          indexSize: '10 MB',
          recordCount: 100000,
          sizePerRecord: '512 bits',
        },
        snowflake: {
          totalSize: '60 MB',
          indexSize: '12 MB',
          recordCount: 100000,
          sizePerRecord: '576 bits',
        },
      };
      service.benchmarkDiskUsage.mockResolvedValue(mockResult);

      const result = await controller.testDiskUsage();

      expect(result.winner).toContain('MB');
    });
  });

  describe('testAll', () => {
    it('should call benchmarkAll with provided parameters', async () => {
      const mockResult = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        update: {
          uuidV7: { updatesPerSecond: 150 },
          uuidV4: { updatesPerSecond: 100 },
          nanoid: { updatesPerSecond: 120 },
          snowflake: { updatesPerSecond: 130 },
        },
        indexSearch: {
          uuidV7: { searchesPerSecond: 333 },
          uuidV4: { searchesPerSecond: 285 },
          nanoid: { searchesPerSecond: 312 },
          snowflake: { searchesPerSecond: 322 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };
      service.benchmarkAll.mockResolvedValue(mockResult);

      const result = await controller.testAll('5000', '500', '500');

      expect(service.benchmarkAll).toHaveBeenCalledWith(5000, 500, 500);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('startTime');
      expect(result).toHaveProperty('endTime');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('recommendations');
    });

    it('should use default parameters when not provided', async () => {
      const mockResult = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        update: {
          uuidV7: { updatesPerSecond: 150 },
          uuidV4: { updatesPerSecond: 100 },
          nanoid: { updatesPerSecond: 120 },
          snowflake: { updatesPerSecond: 130 },
        },
        indexSearch: {
          uuidV7: { searchesPerSecond: 333 },
          uuidV4: { searchesPerSecond: 285 },
          nanoid: { searchesPerSecond: 312 },
          snowflake: { searchesPerSecond: 322 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };
      service.benchmarkAll.mockResolvedValue(mockResult);

      await controller.testAll();

      expect(service.benchmarkAll).toHaveBeenCalledWith(10000, 1000, 1000);
    });

    it('should calculate duration in minutes', async () => {
      const mockResult = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        update: {
          uuidV7: { updatesPerSecond: 150 },
          uuidV4: { updatesPerSecond: 100 },
          nanoid: { updatesPerSecond: 120 },
          snowflake: { updatesPerSecond: 130 },
        },
        indexSearch: {
          uuidV7: { searchesPerSecond: 333 },
          uuidV4: { searchesPerSecond: 285 },
          nanoid: { searchesPerSecond: 312 },
          snowflake: { searchesPerSecond: 322 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };
      service.benchmarkAll.mockResolvedValue(mockResult);

      const result = await controller.testAll('100', '100', '100');

      expect(result.duration).toMatch(/^[\d.]+\s*minutos$/);
      expect(result.duration).toBeTruthy();
    });

    it('should include recommendations', async () => {
      const mockResult = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        update: {
          uuidV7: { updatesPerSecond: 150 },
          uuidV4: { updatesPerSecond: 100 },
          nanoid: { updatesPerSecond: 120 },
          snowflake: { updatesPerSecond: 130 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
        indexSearch: {
          uuidV7: { searchesPerSecond: 333 },
          uuidV4: { searchesPerSecond: 285 },
          nanoid: { searchesPerSecond: 312 },
          snowflake: { searchesPerSecond: 322 },
        },
      };
      service.benchmarkAll.mockResolvedValue(mockResult);

      const result = await controller.testAll('100', '100', '100');

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some((r) => r.includes('INSERT'))).toBe(true);
      expect(result.recommendations.some((r) => r.includes('SELECT'))).toBe(true);
      expect(result.recommendations.some((r) => r.includes('DISCO'))).toBe(true);
    });

    it('should log benchmark start and end', async () => {
      const mockResult = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        update: {
          uuidV7: { updatesPerSecond: 150 },
          uuidV4: { updatesPerSecond: 100 },
          nanoid: { updatesPerSecond: 120 },
          snowflake: { updatesPerSecond: 130 },
        },
        indexSearch: {
          uuidV7: { searchesPerSecond: 333 },
          uuidV4: { searchesPerSecond: 285 },
          nanoid: { searchesPerSecond: 312 },
          snowflake: { searchesPerSecond: 322 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };
      service.benchmarkAll.mockResolvedValue(mockResult);

      await controller.testAll();

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('⏱️'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Iniciando'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('concluído'));
    });
  });

  describe('cleanup', () => {
    it('should call cleanupAll', async () => {
      service.cleanupAll.mockResolvedValue(undefined);

      const result = await controller.cleanup();

      expect(service.cleanupAll).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('sucesso');
    });

    it('should return success message', async () => {
      service.cleanupAll.mockResolvedValue(undefined);

      const result = await controller.cleanup();

      expect(result.message).toBe('Tabelas de benchmark limpas com sucesso');
    });
  });

  describe('parseSize', () => {
    it('should parse various size formats', () => {
      expect(controller['parseSize']('1 B')).toBe(1);
      expect(controller['parseSize']('1 kB')).toBe(1024);
      expect(controller['parseSize']('1 MB')).toBe(1024 * 1024);
      expect(controller['parseSize']('1 GB')).toBe(1024 * 1024 * 1024);
    });

    it('should handle decimal values', () => {
      expect(controller['parseSize']('1.5 MB')).toBe(1.5 * 1024 * 1024);
      expect(controller['parseSize']('2.5 kB')).toBe(2.5 * 1024);
    });

    it('should return 0 for invalid format', () => {
      expect(controller['parseSize']('invalid')).toBe(0);
      expect(controller['parseSize']('')).toBe(0);
      expect(controller['parseSize']('unknown unit XB')).toBe(0);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations from results', () => {
      const results = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };

      const recommendations = controller['generateRecommendations'](results);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should include INSERT winner in recommendations', () => {
      const results = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };

      const recommendations = controller['generateRecommendations'](results);

      expect(recommendations.some((r) => r.includes('INSERT') && r.includes('uuidV7'))).toBe(true);
    });

    it('should include SELECT winner in recommendations', () => {
      const results = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };

      const recommendations = controller['generateRecommendations'](results);

      expect(recommendations.some((r) => r.includes('SELECT') && r.includes('uuidV7'))).toBe(true);
    });

    it('should include DISK winner in recommendations', () => {
      const results = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };

      const recommendations = controller['generateRecommendations'](results);

      expect(recommendations.some((r) => r.includes('DISCO'))).toBe(true);
    });

    it('should include final recommendation for UUID v7', () => {
      const results = {
        insert: {
          uuidV7: { recordsPerSecond: 1000 },
          uuidV4: { recordsPerSecond: 500 },
          nanoid: { recordsPerSecond: 700 },
          snowflake: { recordsPerSecond: 600 },
        },
        select: {
          uuidV7: { queriesPerSecond: 200 },
          uuidV4: { queriesPerSecond: 150 },
          nanoid: { queriesPerSecond: 170 },
          snowflake: { queriesPerSecond: 180 },
        },
        diskUsage: {
          uuidV7: { totalSize: '50 MB', sizePerRecord: '512 bits' },
          uuidV4: { totalSize: '55 MB', sizePerRecord: '512 bits' },
          nanoid: { totalSize: '48 MB', sizePerRecord: '512 bits' },
          snowflake: { totalSize: '60 MB', sizePerRecord: '576 bits' },
        },
      };

      const recommendations = controller['generateRecommendations'](results);

      expect(
        recommendations.some((r) => r.includes('UUID v7') && r.includes('balanceamento')),
      ).toBe(true);
    });
  });
});
