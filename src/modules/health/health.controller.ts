import { Controller, Get, Inject, Injectable, Version } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
import {
  HEALTH_CHECK_SERVICE_PROVIDER,
  type HealthCheckControllerResponse,
  type HealthCheckServiceInterface,
} from '@modules/health/health.interfaces';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HealthCheckResponseDto } from '@modules/health/health.dto';
import { AuthLoginSessionServiceInternalServerErrorDto } from '@modules/error/dtos/errors.dto';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    @Inject(HEALTH_CHECK_SERVICE_PROVIDER)
    private readonly healthCheckService: HealthCheckServiceInterface,
  ) {}

  @Version('1')
  @Get()
  @ApiOperation({
    summary: 'Verifica a saúde do serviço',
    description: `
      Esta rota realiza uma verificação de saúde do serviço.
    `,
  })
  @ApiOkResponse({ type: HealthCheckResponseDto })
  @ApiInternalServerErrorResponse({
    type: AuthLoginSessionServiceInternalServerErrorDto,
  })
  check(): HealthCheckControllerResponse {
    this.logProvider.info({
      message: 'Health check requested',
      context: 'HealthController',
    });
    return this.healthCheckService.execute();
  }
}
