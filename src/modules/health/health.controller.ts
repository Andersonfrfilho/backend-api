import { Controller, Get, Inject, Injectable, Version } from '@nestjs/common';
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

  @Version('1')
  @Get()
  check(): HealthCheckMethodControllerResponse {
    this.logProvider.info({
      message: 'controller',
      context: 'HealthController',
    });
    return this.healthCheckService.healthCheck();
  }

  @Version('2')
  @Get()
  checkV2(): HealthCheckMethodControllerResponse {
    this.logProvider.info({
      message: 'controller v2',
      context: 'HealthController',
    });
    return this.healthCheckService.healthCheck();
  }
}
