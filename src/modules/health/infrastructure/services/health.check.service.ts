import { Inject, Injectable } from '@nestjs/common';

import type {
  HealthCheckServiceInterface,
  HealthCheckServiceResponse,
  HealthCheckUseCaseInterface,
} from '../../domain/health.get.interface';
import { HEALTH_CHECK_USE_CASE_PROVIDER } from '../health.provider';

@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  constructor(
    @Inject(HEALTH_CHECK_USE_CASE_PROVIDER)
    private readonly healthCheckUseCaseProvide: HealthCheckUseCaseInterface,
  ) {}
  execute(): HealthCheckServiceResponse {
    return this.healthCheckUseCaseProvide.execute();
  }
}
