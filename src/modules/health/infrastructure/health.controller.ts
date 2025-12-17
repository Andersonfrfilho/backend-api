import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import type { HealthCheckServiceInterface } from '@modules/health/domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from '@modules/health/infrastructure/health.token';
import { HealthCheckResponseDto } from '@modules/health/shared/health.dto';

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
  @ApiOkResponse({ type: HealthCheckResponseDto })
  check(): HealthCheckResponseDto {
    return this.healthCheckService.execute();
  }
}
