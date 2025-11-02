import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { HealthCheckServiceInterface } from './domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from './infrastructure/health.provider';
import { HealthCheckResponseDto as HealthCheckControllerResponseDto } from './shared/health.dto';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(HEALTH_CHECK_SERVICE_PROVIDER)
    private readonly healthCheckService: HealthCheckServiceInterface,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica a saúde do serviço',
    description: `
      Esta rota realiza uma verificação de saúde do serviço.
    `,
  })
  @ApiOkResponse({ type: HealthCheckControllerResponseDto })
  check(): HealthCheckControllerResponseDto {
    return this.healthCheckService.execute();
  }
}
