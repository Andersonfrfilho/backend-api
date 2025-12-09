import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

/**
 * Benchmark table with UUID v7 IDs
 * Sortable by timestamp, better index performance
 */
@Entity('benchmark_uuid_v7')
@Index('idx_uuid_v7_email', ['email'])
@Index('idx_uuid_v7_city', ['city'])
@Index('idx_uuid_v7_created_at', ['created_at'])
export class BenchmarkUUIDv7Entity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('integer')
  age: number;

  @Column('varchar', { length: 100 })
  city: string;

  @Column('jsonb', { nullable: true })
  data?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at?: Date;
}

/**
 * Benchmark table with Nanoid IDs
 * URL-safe 21-character string
 */
@Entity('benchmark_nanoid')
@Index('idx_nanoid_email', ['email'])
@Index('idx_nanoid_city', ['city'])
@Index('idx_nanoid_created_at', ['created_at'])
export class BenchmarkNanoidEntity {
  @PrimaryColumn('varchar', { length: 21 })
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('integer')
  age: number;

  @Column('varchar', { length: 100 })
  city: string;

  @Column('jsonb', { nullable: true })
  data?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at?: Date;
}

/**
 * Benchmark table with Snowflake IDs
 * Discord-style 64-bit ID (sortable, distributed-friendly)
 */
@Entity('benchmark_snowflake')
@Index('idx_snowflake_email', ['email'])
@Index('idx_snowflake_city', ['city'])
@Index('idx_snowflake_created_at', ['created_at'])
export class BenchmarkSnowflakeEntity {
  @PrimaryColumn('bigint')
  id: string; // Stored as string to preserve precision

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('integer')
  age: number;

  @Column('varchar', { length: 100 })
  city: string;

  @Column('jsonb', { nullable: true })
  data?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', { nullable: true })
  updated_at?: Date;
}
