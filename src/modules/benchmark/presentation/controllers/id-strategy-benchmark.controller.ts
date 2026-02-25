import { Controller, Get, Post, Query } from '@nestjs/common';

import { IDStrategyBenchmarkService } from '../../application/services/id-strategy-benchmark.service';

/**
 * ID Strategy Benchmark Controller
 *
 * Endpoints para rodar benchmarks das 3 estratégias de ID
 *
 * Exemplos de uso:
 * POST /benchmark/insert?count=10000
 * POST /benchmark/select?limit=1000
 * POST /benchmark/update?count=1000
 * POST /benchmark/index-search?iterations=100
 * GET /benchmark/disk-usage
 * GET /benchmark/all?insertCount=10000&selectLimit=1000&updateCount=1000
 */
@Controller('benchmark')
export class IDStrategyBenchmarkController {
  constructor(private benchmarkService: IDStrategyBenchmarkService) {}

  /**
   * Testa INSERT: Qual ID strategy insere mais rápido?
   *
   * @param count Número de registros para inserir (padrão: 10000)
   * @returns Performance das 3 estratégias
   *
   * Exemplo:
   * curl -X POST http://localhost:3000/benchmark/insert?count=5000
   */
  @Post('insert')
  async testInsert(@Query('count') count?: string): Promise<{
    message: string;
    results: any;
    winner: string;
  }> {
    const insertCount = parseInt(count || '10000');
    const results = await this.benchmarkService.benchmarkInsert(insertCount);

    // Determina vencedor
    const fastest = Object.entries(results).reduce((prev, current) => {
      return current[1].recordsPerSecond > prev[1].recordsPerSecond ? current : prev;
    });

    return {
      message: `Insertados ${insertCount} registros em cada tabela`,
      results,
      winner: `${fastest[0]} foi ${Math.round(fastest[1].recordsPerSecond)} registros/s`,
    };
  }

  /**
   * Testa SELECT: Qual ID strategy consulta mais rápido?
   *
   * @param limit Número de registros por query (padrão: 1000)
   * @returns Performance das 3 estratégias
   *
   * Exemplo:
   * curl -X POST http://localhost:3000/benchmark/select?limit=500
   */
  @Post('select')
  async testSelect(@Query('limit') limit?: string): Promise<{
    message: string;
    results: any;
    winner: string;
  }> {
    const selectLimit = parseInt(limit || '1000');
    const results = await this.benchmarkService.benchmarkSelect(selectLimit);

    const fastest = Object.entries(results).reduce((prev, current) => {
      return current[1].queriesPerSecond > prev[1].queriesPerSecond ? current : prev;
    });

    return {
      message: `Executadas queries com LIMIT ${selectLimit}`,
      results,
      winner: `${fastest[0]} foi ${fastest[1].queriesPerSecond} queries/s`,
    };
  }

  /**
   * Testa UPDATE: Qual ID strategy atualiza mais rápido?
   *
   * @param count Número de registros para atualizar (padrão: 1000)
   * @returns Performance das 3 estratégias
   *
   * Exemplo:
   * curl -X POST http://localhost:3000/benchmark/update?count=500
   */
  @Post('update')
  async testUpdate(@Query('count') count?: string): Promise<{
    message: string;
    results: any;
    winner: string;
  }> {
    const updateCount = parseInt(count || '1000');
    const results = await this.benchmarkService.benchmarkUpdate(updateCount);

    const fastest = Object.entries(results).reduce((prev, current) => {
      return current[1].updatesPerSecond > prev[1].updatesPerSecond ? current : prev;
    });

    return {
      message: `Atualizados ${updateCount} registros`,
      results,
      winner: `${fastest[0]} foi ${fastest[1].updatesPerSecond} updates/s`,
    };
  }

  /**
   * Testa INDEX SEARCH: Qual ID strategy filtra por índice mais rápido?
   *
   * @param iterations Número de buscas (padrão: 100)
   * @returns Performance das 3 estratégias
   *
   * Exemplo:
   * curl -X POST http://localhost:3000/benchmark/index-search?iterations=50
   */
  @Post('index-search')
  async testIndexSearch(@Query('iterations') iterations?: string): Promise<{
    message: string;
    results: any;
    winner: string;
  }> {
    const iterationCount = parseInt(iterations || '100');
    const results = await this.benchmarkService.benchmarkIndexSearch(iterationCount);

    const fastest = Object.entries(results).reduce((prev, current) => {
      return current[1].searchesPerSecond > prev[1].searchesPerSecond ? current : prev;
    });

    return {
      message: `Executadas ${iterationCount} buscas por índice (city)`,
      results,
      winner: `${fastest[0]} foi ${fastest[1].searchesPerSecond} searches/s`,
    };
  }

  /**
   * Verifica USO DE DISCO: Qual ID strategy usa menos espaço?
   *
   * @returns Tamanho em disco de cada tabela
   *
   * Exemplo:
   * curl -X GET http://localhost:3000/benchmark/disk-usage
   */
  @Get('disk-usage')
  async testDiskUsage(): Promise<{
    message: string;
    results: any;
    winner: string;
  }> {
    const results = await this.benchmarkService.benchmarkDiskUsage();

    // Encontra a que usa menos espaço
    const smallest = Object.entries(results).reduce((prev, current) => {
      const prevSize = this.parseSize(prev[1].totalSize);
      const currentSize = this.parseSize(current[1].totalSize);
      return currentSize < prevSize ? current : prev;
    });

    return {
      message: 'Uso de disco para cada estratégia de ID',
      results,
      winner: `${smallest[0]} usa menos espaço (${smallest[1].totalSize})`,
    };
  }

  /**
   * TESTE COMPLETO: Todos os benchmarks em sequência
   *
   * @param insertCount Registros para INSERT (padrão: 10000)
   * @param selectLimit LIMIT para SELECT (padrão: 1000)
   * @param updateCount Registros para UPDATE (padrão: 1000)
   * @returns Todos os benchmarks
   *
   * ⚠️ AVISO: Este teste demora alguns minutos!
   *
   * Exemplo:
   * curl -X GET "http://localhost:3000/benchmark/all?insertCount=5000"
   */
  @Get('all')
  async testAll(
    @Query('insertCount') insertCount?: string,
    @Query('selectLimit') selectLimit?: string,
    @Query('updateCount') updateCount?: string,
  ): Promise<{
    message: string;
    startTime: string;
    endTime: string;
    duration: string;
    results: any;
    recommendations: string[];
  }> {
    const start = new Date();
    console.log(`\n⏱️ Iniciando benchmark completo às ${start.toISOString()}`);

    const insertCountNum = parseInt(insertCount || '10000');
    const selectLimitNum = parseInt(selectLimit || '1000');
    const updateCountNum = parseInt(updateCount || '1000');

    const results = await this.benchmarkService.benchmarkAll(
      insertCountNum,
      selectLimitNum,
      updateCountNum,
    );

    const end = new Date();
    const durationMs = end.getTime() - start.getTime();
    const durationMin = (durationMs / 60000).toFixed(2);

    const recommendations = this.generateRecommendations(results);

    console.log(`✅ Benchmark concluído às ${end.toISOString()}`);
    console.log(`⏱️ Total: ${durationMin} minutos\n`);

    return {
      message: 'Benchmark completo das 3 estratégias de ID',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: `${durationMin} minutos`,
      results,
      recommendations,
    };
  }

  /**
   * LIMPAR: Remove todos os dados de teste
   *
   * Exemplo:
   * curl -X POST http://localhost:3000/benchmark/cleanup
   */
  @Post('cleanup')
  async cleanup(): Promise<{
    message: string;
  }> {
    await this.benchmarkService.cleanupAll();
    return {
      message: 'Tabelas de benchmark limpas com sucesso',
    };
  }

  // ========================================================================
  // Helper Methods
  // ========================================================================

  private parseSize(sizeStr: string): number {
    const units: Record<string, number> = {
      B: 1,
      kB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    const match = sizeStr.match(/^([\d.]+)\s*(\w+)$/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2];
    return value * (units[unit] || 1);
  }

  private generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    // Análise de INSERT
    const insertWinner = Object.entries(
      results.insert as Record<string, { recordsPerSecond: number }>,
    ).reduce(
      (
        prev: [string, { recordsPerSecond: number }],
        current: [string, { recordsPerSecond: number }],
      ) => {
        return current[1].recordsPerSecond > prev[1].recordsPerSecond ? current : prev;
      },
    );
    recommendations.push(
      `📝 INSERT: ${insertWinner[0]} é ${Math.round(insertWinner[1].recordsPerSecond)} registros/s`,
    );

    // Análise de SELECT
    const selectWinner = Object.entries(
      results.select as Record<string, { queriesPerSecond: number }>,
    ).reduce(
      (
        prev: [string, { queriesPerSecond: number }],
        current: [string, { queriesPerSecond: number }],
      ) => {
        return current[1].queriesPerSecond > prev[1].queriesPerSecond ? current : prev;
      },
    );
    recommendations.push(
      `🔍 SELECT: ${selectWinner[0]} é ${selectWinner[1].queriesPerSecond} queries/s`,
    );

    // Análise de DISK
    const diskWinner = Object.entries(
      results.diskUsage as Record<string, { totalSize: string; sizePerRecord: string }>,
    ).reduce(
      (
        prev: [string, { totalSize: string; sizePerRecord: string }],
        current: [string, { totalSize: string; sizePerRecord: string }],
      ) => {
        const prevSize = this.parseSize(prev[1].totalSize);
        const currentSize = this.parseSize(current[1].totalSize);
        return currentSize < prevSize ? current : prev;
      },
    );
    recommendations.push(
      `💾 DISCO: ${diskWinner[0]} usa ${diskWinner[1].totalSize} (${diskWinner[1].sizePerRecord}/registro)`,
    );

    // Recomendação final
    recommendations.push('✅ Para backend-api: Mantenha UUID v7 (melhor balanceamento)');

    return recommendations;
  }
}
