import { Injectable } from '@nestjs/common';

/**
 * Snowflake ID Generator Service
 *
 * Implementação do padrão Discord Snowflake para geração de IDs distribuídos
 * Formato (64 bits): [timestamp 41][datacenter 5][worker 5][sequence 12]
 */
@Injectable()
export class SnowflakeIDGeneratorService {
  private lastTimestamp = 0;
  private sequence = 0;

  // Configurações
  private readonly WORKER_ID = parseInt(process.env.WORKER_ID || '1');
  private readonly DATACENTER_ID = parseInt(process.env.DATACENTER_ID || '1');
  private readonly EPOCH = 1704067200000; // 2024-01-01

  constructor() {
    this.validate();
  }

  /**
   * Valida configuração na inicialização
   */
  private validate(): void {
    if (this.WORKER_ID < 0 || this.WORKER_ID > 31) {
      throw new Error('WORKER_ID must be between 0 and 31');
    }
    if (this.DATACENTER_ID < 0 || this.DATACENTER_ID > 31) {
      throw new Error('DATACENTER_ID must be between 0 and 31');
    }
  }

  /**
   * Gera um novo Snowflake ID
   */
  generate(): string {
    let timestamp = Date.now();

    if (timestamp === this.lastTimestamp) {
      // Mesmo millisegundo: incrementa sequence
      this.sequence = (this.sequence + 1) % 4096; // 12 bits = max 4096

      if (this.sequence === 0) {
        // Overflow: espera próximo ms
        while (Date.now() <= this.lastTimestamp) {
          // busy wait
        }
        timestamp = Date.now();
      }
    } else {
      // Novo millisegundo: reset sequence
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id = BigInt(
      (BigInt(timestamp - this.EPOCH) << 22n) | // timestamp shifted left 22
        (BigInt(this.DATACENTER_ID) << 17n) | // datacenter shifted left 17
        (BigInt(this.WORKER_ID) << 12n) | // worker shifted left 12
        BigInt(this.sequence), // sequence
    );

    return id.toString();
  }

  /**
   * Extrai o timestamp original de um ID Snowflake
   */
  extractTimestamp(snowflakeId: string): Date {
    const id = BigInt(snowflakeId);
    const timestamp = (id >> 22n) + BigInt(this.EPOCH);
    return new Date(Number(timestamp));
  }

  /**
   * Extrai o datacenter ID
   */
  extractDatacenterId(snowflakeId: string): number {
    const id = BigInt(snowflakeId);
    return Number((id >> 17n) & 0x1fn);
  }

  /**
   * Extrai o worker ID
   */
  extractWorkerId(snowflakeId: string): number {
    const id = BigInt(snowflakeId);
    return Number((id >> 12n) & 0x1fn);
  }

  /**
   * Extrai o sequence number
   */
  extractSequence(snowflakeId: string): number {
    const id = BigInt(snowflakeId);
    return Number(id & 0xfffn);
  }
}
