import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckControllerInterface,
  HealthCheckMethodControllerResponse,
} from './health.service.interfaces';
import { HealthCheckService } from './health.service';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from 'src/providers/log/log.interface';

@Injectable()
@Controller('/health')
export class HealthController {
  constructor(
    @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface,
    private readonly healthCheckService: HealthCheckService,
  ) {}

  @Get()
  check(): HealthCheckMethodControllerResponse {
    //TODO:: add log testing to show same id request
    this.logProvider.info('controller');
    return this.healthCheckService.healthCheck();
  }
}
