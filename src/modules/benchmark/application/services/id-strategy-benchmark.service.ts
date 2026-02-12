import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';

import {
  BenchmarkNanoidEntity,
  BenchmarkSnowflakeEntity,
  BenchmarkUUIDv4Entity,
  BenchmarkUUIDv7Entity,
} from '../../domain/entities/benchmark.entities';
import { SnowflakeIDGeneratorService } from '../../infrastructure/services/snowflake-id-generator.service';

@Injectable()
export class IDStrategyBenchmarkService {
  constructor(
    @InjectRepository(BenchmarkUUIDv7Entity, 'postgres')
    private uuidV7Repo: Repository<BenchmarkUUIDv7Entity>,

    @InjectRepository(BenchmarkUUIDv4Entity, 'postgres')
    private uuidV4Repo: Repository<BenchmarkUUIDv4Entity>,

    @InjectRepository(BenchmarkNanoidEntity, 'postgres')
    private nanoidRepo: Repository<BenchmarkNanoidEntity>,

    @InjectRepository(BenchmarkSnowflakeEntity, 'postgres')
    private snowflakeRepo: Repository<BenchmarkSnowflakeEntity>,

    private snowflakeGenerator: SnowflakeIDGeneratorService,
  ) {}

  /**
   * Teste de INSERT: Quantos registros por segundo?
   */
  async benchmarkInsert(count: number = 10000): Promise<{
    uuidV7: {
      duration: number;
      recordsPerSecond: number;
      avgTimePerRecord: number;
    };
    uuidV4: {
      duration: number;
      recordsPerSecond: number;
      avgTimePerRecord: number;
    };
    nanoid: {
      duration: number;
      recordsPerSecond: number;
      avgTimePerRecord: number;
    };
    snowflake: {
      duration: number;
      recordsPerSecond: number;
      avgTimePerRecord: number;
    };
  }> {
    const results = {
      uuidV7: await this.benchmarkInsertStrategy(this.uuidV7Repo, count),
      uuidV4: await this.benchmarkInsertStrategy(this.uuidV4Repo, count),
      nanoid: await this.benchmarkInsertStrategy(this.nanoidRepo, count, 'nanoid'),
      snowflake: await this.benchmarkInsertStrategy(this.snowflakeRepo, count, 'snowflake'),
    };

    return results;
  }

  /**
   * Teste de SELECT: Queries por segundo?
   */
  async benchmarkSelect(limit: number = 1000): Promise<{
    uuidV7: {
      duration: number;
      queriesPerSecond: number;
    };
    uuidV4: {
      duration: number;
      queriesPerSecond: number;
    };
    nanoid: {
      duration: number;
      queriesPerSecond: number;
    };
    snowflake: {
      duration: number;
      queriesPerSecond: number;
    };
  }> {
    return {
      uuidV7: await this.benchmarkSelectStrategy(this.uuidV7Repo, limit),
      uuidV4: await this.benchmarkSelectStrategy(this.uuidV4Repo, limit),
      nanoid: await this.benchmarkSelectStrategy(this.nanoidRepo, limit),
      snowflake: await this.benchmarkSelectStrategy(this.snowflakeRepo, limit),
    };
  }

  /**
   * Teste de UPDATE: Updates por segundo?
   */
  async benchmarkUpdate(count: number = 1000): Promise<{
    uuidV7: {
      duration: number;
      updatesPerSecond: number;
    };
    uuidV4: {
      duration: number;
      updatesPerSecond: number;
    };
    nanoid: {
      duration: number;
      updatesPerSecond: number;
    };
    snowflake: {
      duration: number;
      updatesPerSecond: number;
    };
  }> {
    return {
      uuidV7: await this.benchmarkUpdateStrategy(this.uuidV7Repo, count),
      uuidV4: await this.benchmarkUpdateStrategy(this.uuidV4Repo, count),
      nanoid: await this.benchmarkUpdateStrategy(this.nanoidRepo, count),
      snowflake: await this.benchmarkUpdateStrategy(this.snowflakeRepo, count),
    };
  }

  /**
   * Teste de INDEX: Buscar por email é rápido?
   */
  async benchmarkIndexSearch(iterations: number = 100): Promise<{
    uuidV7: {
      duration: number;
      searchesPerSecond: number;
    };
    uuidV4: {
      duration: number;
      searchesPerSecond: number;
    };
    nanoid: {
      duration: number;
      searchesPerSecond: number;
    };
    snowflake: {
      duration: number;
      searchesPerSecond: number;
    };
  }> {
    return {
      uuidV7: await this.benchmarkIndexSearchStrategy(this.uuidV7Repo, iterations),
      uuidV4: await this.benchmarkIndexSearchStrategy(this.uuidV4Repo, iterations),
      nanoid: await this.benchmarkIndexSearchStrategy(this.nanoidRepo, iterations),
      snowflake: await this.benchmarkIndexSearchStrategy(this.snowflakeRepo, iterations),
    };
  }

  /**
   * Teste de DISK USAGE: Qual usa mais espaço?
   */
  async benchmarkDiskUsage(): Promise<{
    uuidV7: {
      totalSize: string;
      indexSize: string;
      recordCount: number;
      sizePerRecord: string;
    };
    uuidV4: {
      totalSize: string;
      indexSize: string;
      recordCount: number;
      sizePerRecord: string;
    };
    nanoid: {
      totalSize: string;
      indexSize: string;
      recordCount: number;
      sizePerRecord: string;
    };
    snowflake: {
      totalSize: string;
      indexSize: string;
      recordCount: number;
      sizePerRecord: string;
    };
  }> {
    return {
      uuidV7: await this.benchmarkDiskUsageStrategy(this.uuidV7Repo, 'benchmark_uuid_v7'),
      uuidV4: await this.benchmarkDiskUsageStrategy(this.uuidV4Repo, 'benchmark_uuid_v4'),
      nanoid: await this.benchmarkDiskUsageStrategy(this.nanoidRepo, 'benchmark_nanoid'),
      snowflake: await this.benchmarkDiskUsageStrategy(this.snowflakeRepo, 'benchmark_snowflake'),
    };
  }

  /**
   * Teste completo: Todos os benchmarks
   */
  async benchmarkAll(
    insertCount = 10000,
    selectLimit = 1000,
    updateCount = 1000,
  ): Promise<{
    insert: any;
    select: any;
    update: any;
    indexSearch: any;
    diskUsage: any;
  }> {
    console.log('🔄 Executando INSERT benchmark...');
    const insert = await this.benchmarkInsert(insertCount);

    console.log('🔄 Executando SELECT benchmark...');
    const select = await this.benchmarkSelect(selectLimit);

    console.log('🔄 Executando UPDATE benchmark...');
    const update = await this.benchmarkUpdate(updateCount);

    console.log('🔄 Executando INDEX SEARCH benchmark...');
    const indexSearch = await this.benchmarkIndexSearch(100);

    console.log('🔄 Executando DISK USAGE benchmark...');
    const diskUsage = await this.benchmarkDiskUsage();

    return {
      insert,
      select,
      update,
      indexSearch,
      diskUsage,
    };
  }

  /**
   * Limpa todas as tabelas para novo teste
   */
  async cleanupAll(): Promise<void> {
    await this.uuidV7Repo.query('TRUNCATE TABLE benchmark_uuid_v7 CASCADE');
    await this.uuidV4Repo.query('TRUNCATE TABLE benchmark_uuid_v4 CASCADE');
    await this.nanoidRepo.query('TRUNCATE TABLE benchmark_nanoid CASCADE');
    await this.snowflakeRepo.query('TRUNCATE TABLE benchmark_snowflake CASCADE');
    console.log('✅ Tabelas limpas');
  }

  // ========================================================================
  // Private Methods
  // ========================================================================

  private async benchmarkInsertStrategy(
    repo: Repository<any>,
    count: number,
    idStrategy?: 'nanoid' | 'snowflake',
  ): Promise<{
    duration: number;
    recordsPerSecond: number;
    avgTimePerRecord: number;
  }> {
    const startTime = performance.now();
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'];

    for (let i = 0; i < count; i++) {
      const record: any = {
        name: `Benchmark User ${i}`,
        email: `benchmark${i}@example.com`,
        age: Math.floor(Math.random() * 80) + 18,
        city: cities[Math.floor(Math.random() * cities.length)],
        data: { benchmark: true, iteration: i },
      };

      if (idStrategy === 'nanoid') {
        record.id = nanoid();
      } else if (idStrategy === 'snowflake') {
        record.id = this.snowflakeGenerator.generate();
      }
      // UUID v7 é auto-gerado pelo banco

      await repo.save(record);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const recordsPerSecond = (count / duration) * 1000;
    const avgTimePerRecord = duration / count;

    return {
      duration: Math.round(duration),
      recordsPerSecond: Math.round(recordsPerSecond),
      avgTimePerRecord: Math.round(avgTimePerRecord * 100) / 100,
    };
  }

  private async benchmarkSelectStrategy(
    repo: Repository<any>,
    limit: number,
  ): Promise<{
    duration: number;
    queriesPerSecond: number;
  }> {
    const startTime = performance.now();

    // Simula 10 queries diferentes
    for (let i = 0; i < 10; i++) {
      await repo.find({
        take: limit,
        skip: i * limit,
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const queriesPerSecond = (10 / duration) * 1000;

    return {
      duration: Math.round(duration),
      queriesPerSecond: Math.round(queriesPerSecond * 100) / 100,
    };
  }

  private async benchmarkUpdateStrategy(
    repo: Repository<any>,
    count: number,
  ): Promise<{
    duration: number;
    updatesPerSecond: number;
  }> {
    const startTime = performance.now();
    const records = await repo.find({ take: count });

    for (const record of records) {
      await repo.update(record.id as string | number, {
        data: { updated: true, timestamp: new Date() },
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const updatesPerSecond = (count / duration) * 1000;

    return {
      duration: Math.round(duration),
      updatesPerSecond: Math.round(updatesPerSecond),
    };
  }

  private async benchmarkIndexSearchStrategy(
    repo: Repository<any>,
    iterations: number,
  ): Promise<{
    duration: number;
    searchesPerSecond: number;
  }> {
    const startTime = performance.now();
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];

    for (let i = 0; i < iterations; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      await repo.find({ where: { city } });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const searchesPerSecond = (iterations / duration) * 1000;

    return {
      duration: Math.round(duration),
      searchesPerSecond: Math.round(searchesPerSecond * 100) / 100,
    };
  }

  private async benchmarkDiskUsageStrategy(
    repo: Repository<any>,
    tableName: string,
  ): Promise<{
    totalSize: string;
    indexSize: string;
    recordCount: number;
    sizePerRecord: string;
  }> {
    const manager = repo.manager;

    // Total size
    const sizeResult = await manager.query(`
      SELECT
        pg_size_pretty(pg_total_relation_size('${tableName}')) as total_size,
        pg_size_pretty(pg_indexes_size('${tableName}')) as index_size
    `);

    // Record count
    const countResult = await manager.query(`SELECT COUNT(*) as count FROM ${tableName}`);

    const totalSize = sizeResult[0].total_size;
    const indexSize = sizeResult[0].index_size;
    const recordCount = parseInt(String(countResult[0].count));
    const tableSizeBytes = await this.getTableSizeBytes(manager, tableName);
    const sizePerRecord =
      recordCount > 0 ? ((tableSizeBytes / recordCount) * 8).toFixed(2) + ' bits' : 'N/A';

    return {
      totalSize,
      indexSize,
      recordCount,
      sizePerRecord,
    };
  }

  private async getTableSizeBytes(manager: any, tableName: string): Promise<number> {
    const result = await manager.query(`
      SELECT pg_total_relation_size('${tableName}') as size
    `);
    return parseInt(String(result[0].size));
  }
}
