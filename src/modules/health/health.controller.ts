import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import type { HealthCheckMethodControllerResponse } from './health.service.interfaces';
import { HealthCheckService } from './health.service';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface,
    private readonly healthCheckService: HealthCheckService,
  ) {}

  @Get()
  check(): HealthCheckMethodControllerResponse {
    this.logProvider.info('controller');
    return this.healthCheckService.healthCheck();
  }
}
