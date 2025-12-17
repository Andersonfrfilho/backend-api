import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HealthCheckServiceInterface } from './domain/health.get.interface';
import { HEALTH_CHECK_SERVICE_PROVIDER } from './infrastructure/health.token';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HEALTH_CHECK_SERVICE_PROVIDER)
    private readonly healthCheckService: HealthCheckServiceInterface,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Service is healthy' })
  async check() {
    return this.healthCheckService.execute();
  }
}
