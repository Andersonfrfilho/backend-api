import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';

import {
  BenchmarkNanoidEntity,
  BenchmarkSnowflakeEntity,
  BenchmarkUUIDv4Entity,
  BenchmarkUUIDv7Entity,
} from '../../domain/entities/benchmark.entities';
import { SnowflakeIDGeneratorService } from '../../infrastructure/services/snowflake-id-generator.service';
import { IDStrategyBenchmarkService } from './id-strategy-benchmark.service';

describe('IDStrategyBenchmarkService', () => {
  let service: IDStrategyBenchmarkService;
  let uuidV7Repo: jest.Mocked<Repository<BenchmarkUUIDv7Entity>>;
  let uuidV4Repo: jest.Mocked<Repository<BenchmarkUUIDv4Entity>>;
  let nanoidRepo: jest.Mocked<Repository<BenchmarkNanoidEntity>>;
  let snowflakeRepo: jest.Mocked<Repository<BenchmarkSnowflakeEntity>>;
  let snowflakeGenerator: jest.Mocked<SnowflakeIDGeneratorService>;

  beforeEach(() => {
    uuidV7Repo = {
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      manager: {
        query: jest.fn(),
      },
    } as any;

    uuidV4Repo = {
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      manager: {
        query: jest.fn(),
      },
    } as any;

    nanoidRepo = {
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      manager: {
        query: jest.fn(),
      },
    } as any;

    snowflakeRepo = {
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      manager: {
        query: jest.fn(),
      },
    } as any;

    snowflakeGenerator = {
      generate: jest.fn().mockReturnValue('123456789'),
    } as any;

    service = new IDStrategyBenchmarkService(
      uuidV7Repo,
      uuidV4Repo,
      nanoidRepo,
      snowflakeRepo,
      snowflakeGenerator,
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('benchmarkInsert', () => {
    it('should benchmark insert for all strategies', async () => {
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      nanoidRepo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      const result = await service.benchmarkInsert(10);

      expect(result).toHaveProperty('uuidV7');
      expect(result).toHaveProperty('uuidV4');
      expect(result).toHaveProperty('nanoid');
      expect(result).toHaveProperty('snowflake');

      expect(result.uuidV7).toHaveProperty('duration');
      expect(result.uuidV7).toHaveProperty('recordsPerSecond');
      expect(result.uuidV7).toHaveProperty('avgTimePerRecord');
    });

    it('should use default count of 10000 when not provided', async () => {
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      nanoidRepo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      await service.benchmarkInsert();

      expect(uuidV7Repo.save).toHaveBeenCalledTimes(10000);
    });

    it('should generate nanoid IDs for nanoid strategy', async () => {
      nanoidRepo.save.mockResolvedValue({} as any);
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      await service.benchmarkInsert(1);

      const callArg = nanoidRepo.save.mock.calls[0][0];
      expect(callArg).toHaveProperty('id');
      expect(typeof callArg.id).toBe('string');
    });

    it('should generate snowflake IDs for snowflake strategy', async () => {
      nanoidRepo.save.mockResolvedValue({} as any);
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      await service.benchmarkInsert(1);

      expect(snowflakeGenerator.generate).toHaveBeenCalled();
    });
  });

  describe('benchmarkSelect', () => {
    it('should benchmark select for all strategies', async () => {
      const mockRecords = [{ id: '1', name: 'Test' }];
      uuidV7Repo.find.mockResolvedValue(mockRecords as any);
      uuidV4Repo.find.mockResolvedValue(mockRecords as any);
      nanoidRepo.find.mockResolvedValue(mockRecords as any);
      snowflakeRepo.find.mockResolvedValue(mockRecords as any);

      const result = await service.benchmarkSelect(100);

      expect(result).toHaveProperty('uuidV7');
      expect(result).toHaveProperty('uuidV4');
      expect(result).toHaveProperty('nanoid');
      expect(result).toHaveProperty('snowflake');

      expect(result.uuidV7).toHaveProperty('duration');
      expect(result.uuidV7).toHaveProperty('queriesPerSecond');
    });

    it('should use default limit of 1000 when not provided', async () => {
      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      await service.benchmarkSelect();

      // Should execute 10 queries per repository (10 total repos * 4 queries)
      expect(uuidV7Repo.find).toHaveBeenCalledTimes(10);
    });
  });

  describe('benchmarkUpdate', () => {
    it('should benchmark update for all strategies', async () => {
      const mockRecords = [
        { id: '1', name: 'Test' },
        { id: '2', name: 'Test2' },
      ];
      uuidV7Repo.find.mockResolvedValue(mockRecords as any);
      uuidV4Repo.find.mockResolvedValue(mockRecords as any);
      nanoidRepo.find.mockResolvedValue(mockRecords as any);
      snowflakeRepo.find.mockResolvedValue(mockRecords as any);

      uuidV7Repo.update.mockResolvedValue({} as any);
      uuidV4Repo.update.mockResolvedValue({} as any);
      nanoidRepo.update.mockResolvedValue({} as any);
      snowflakeRepo.update.mockResolvedValue({} as any);

      const result = await service.benchmarkUpdate(2);

      expect(result).toHaveProperty('uuidV7');
      expect(result).toHaveProperty('uuidV4');
      expect(result).toHaveProperty('nanoid');
      expect(result).toHaveProperty('snowflake');

      expect(result.uuidV7).toHaveProperty('duration');
      expect(result.uuidV7).toHaveProperty('updatesPerSecond');
    });

    it('should update all found records', async () => {
      const mockRecords = [{ id: '1' }, { id: '2' }];
      uuidV7Repo.find.mockResolvedValue(mockRecords as any);
      uuidV7Repo.update.mockResolvedValue({} as any);

      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      await service.benchmarkUpdate(2);

      expect(uuidV7Repo.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('benchmarkIndexSearch', () => {
    it('should benchmark index search for all strategies', async () => {
      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      const result = await service.benchmarkIndexSearch(10);

      expect(result).toHaveProperty('uuidV7');
      expect(result).toHaveProperty('uuidV4');
      expect(result).toHaveProperty('nanoid');
      expect(result).toHaveProperty('snowflake');

      expect(result.uuidV7).toHaveProperty('duration');
      expect(result.uuidV7).toHaveProperty('searchesPerSecond');
    });

    it('should use default iterations of 100 when not provided', async () => {
      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      await service.benchmarkIndexSearch();

      expect(uuidV7Repo.find).toHaveBeenCalledTimes(100);
    });

    it('should search with where clause for city', async () => {
      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      await service.benchmarkIndexSearch(1);

      const callArg = uuidV7Repo.find.mock.calls[0][0];
      expect(callArg).toHaveProperty('where');
      expect(callArg.where).toHaveProperty('city');
    });
  });

  describe('benchmarkDiskUsage', () => {
    it('should benchmark disk usage for all strategies', async () => {
      const mockSizeResult = [{ total_size: '1 MB', index_size: '100 kB' }];
      const mockCountResult = [{ count: '100' }];

      uuidV7Repo.manager.query.mockResolvedValue(mockSizeResult);
      uuidV4Repo.manager.query.mockResolvedValue(mockSizeResult);
      nanoidRepo.manager.query.mockResolvedValue(mockSizeResult);
      snowflakeRepo.manager.query.mockResolvedValue(mockSizeResult);

      const result = await service.benchmarkDiskUsage();

      expect(result).toHaveProperty('uuidV7');
      expect(result).toHaveProperty('uuidV4');
      expect(result).toHaveProperty('nanoid');
      expect(result).toHaveProperty('snowflake');

      expect(result.uuidV7).toHaveProperty('totalSize');
      expect(result.uuidV7).toHaveProperty('indexSize');
      expect(result.uuidV7).toHaveProperty('recordCount');
      expect(result.uuidV7).toHaveProperty('sizePerRecord');
    });

    it('should handle disk usage calculation correctly', async () => {
      const mockSizeResult = [{ total_size: '10 MB', index_size: '1 MB' }];
      const mockCountResult = [{ count: '1000' }];

      uuidV7Repo.manager.query
        .mockResolvedValueOnce(mockSizeResult)
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce([{ size: '10485760' }]);

      uuidV4Repo.manager.query
        .mockResolvedValueOnce(mockSizeResult)
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce([{ size: '10485760' }]);

      nanoidRepo.manager.query
        .mockResolvedValueOnce(mockSizeResult)
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce([{ size: '10485760' }]);

      snowflakeRepo.manager.query
        .mockResolvedValueOnce(mockSizeResult)
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce([{ size: '10485760' }]);

      const result = await service.benchmarkDiskUsage();

      expect(result.uuidV7.totalSize).toBe('10 MB');
      expect(result.uuidV7.recordCount).toBe(1000);
    });
  });

  describe('benchmarkAll', () => {
    it('should run all benchmarks in sequence', async () => {
      // Mock all repositories
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      nanoidRepo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      uuidV7Repo.update.mockResolvedValue({} as any);
      uuidV4Repo.update.mockResolvedValue({} as any);
      nanoidRepo.update.mockResolvedValue({} as any);
      snowflakeRepo.update.mockResolvedValue({} as any);

      const mockSizeResult = [{ total_size: '1 MB', index_size: '100 kB' }];
      uuidV7Repo.manager.query.mockResolvedValue(mockSizeResult);
      uuidV4Repo.manager.query.mockResolvedValue(mockSizeResult);
      nanoidRepo.manager.query.mockResolvedValue(mockSizeResult);
      snowflakeRepo.manager.query.mockResolvedValue(mockSizeResult);

      const result = await service.benchmarkAll(1, 1, 1);

      expect(result).toHaveProperty('insert');
      expect(result).toHaveProperty('select');
      expect(result).toHaveProperty('update');
      expect(result).toHaveProperty('indexSearch');
      expect(result).toHaveProperty('diskUsage');

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('🔄'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('INSERT'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('UPDATE'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('INDEX SEARCH'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('DISK USAGE'));
    });

    it('should use default parameters when not provided', async () => {
      // Setup all mocks
      uuidV7Repo.save.mockResolvedValue({} as any);
      uuidV4Repo.save.mockResolvedValue({} as any);
      nanoidRepo.save.mockResolvedValue({} as any);
      snowflakeRepo.save.mockResolvedValue({} as any);

      uuidV7Repo.find.mockResolvedValue([]);
      uuidV4Repo.find.mockResolvedValue([]);
      nanoidRepo.find.mockResolvedValue([]);
      snowflakeRepo.find.mockResolvedValue([]);

      uuidV7Repo.update.mockResolvedValue({} as any);
      uuidV4Repo.update.mockResolvedValue({} as any);
      nanoidRepo.update.mockResolvedValue({} as any);
      snowflakeRepo.update.mockResolvedValue({} as any);

      const mockSizeResult = [{ total_size: '1 MB', index_size: '100 kB' }];
      uuidV7Repo.manager.query.mockResolvedValue(mockSizeResult);
      uuidV4Repo.manager.query.mockResolvedValue(mockSizeResult);
      nanoidRepo.manager.query.mockResolvedValue(mockSizeResult);
      snowflakeRepo.manager.query.mockResolvedValue(mockSizeResult);

      await service.benchmarkAll();

      expect(uuidV7Repo.save).toHaveBeenCalledTimes(10000);
    });
  });

  describe('cleanupAll', () => {
    it('should truncate all benchmark tables', async () => {
      uuidV7Repo.query.mockResolvedValue([]);
      uuidV4Repo.query.mockResolvedValue([]);
      nanoidRepo.query.mockResolvedValue([]);
      snowflakeRepo.query.mockResolvedValue([]);

      await service.cleanupAll();

      expect(uuidV7Repo.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE benchmark_uuid_v7'),
      );
      expect(uuidV4Repo.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE benchmark_uuid_v4'),
      );
      expect(nanoidRepo.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE benchmark_nanoid'),
      );
      expect(snowflakeRepo.query).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE benchmark_snowflake'),
      );
    });

    it('should log success message', async () => {
      uuidV7Repo.query.mockResolvedValue([]);
      uuidV4Repo.query.mockResolvedValue([]);
      nanoidRepo.query.mockResolvedValue([]);
      snowflakeRepo.query.mockResolvedValue([]);

      await service.cleanupAll();

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('✅'));
    });
  });
});
