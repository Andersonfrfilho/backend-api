import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckControllerInterface,
  HealthCheckMethodControllerResponse,
} from './health.service.interfaces';
import { HealthCheckService } from './health.service';

@Controller('/health')
export class HealthController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  check(): HealthCheckMethodControllerResponse {
    return this.healthCheckService.healthCheck();
  }
}
