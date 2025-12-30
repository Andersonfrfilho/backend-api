import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONNECTIONS_NAMES } from '../shared/infrastructure/providers/database/database.constant';

import { IDStrategyBenchmarkService } from './application/services/id-strategy-benchmark.service';
import {
  BenchmarkNanoidEntity,
  BenchmarkSnowflakeEntity,
  BenchmarkUUIDv4Entity,
  BenchmarkUUIDv7Entity,
} from './domain/entities/benchmark.entities';
import { SnowflakeIDGeneratorService } from './infrastructure/services/snowflake-id-generator.service';
import { IDStrategyBenchmarkController } from './presentation/controllers/id-strategy-benchmark.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        BenchmarkUUIDv7Entity,
        BenchmarkUUIDv4Entity,
        BenchmarkNanoidEntity,
        BenchmarkSnowflakeEntity,
      ],
      CONNECTIONS_NAMES.POSTGRES,
    ),
  ],
  providers: [IDStrategyBenchmarkService, SnowflakeIDGeneratorService],
  controllers: [IDStrategyBenchmarkController],
  exports: [IDStrategyBenchmarkService],
})
export class BenchmarkModule {}
