import { Inject, Injectable } from '@nestjs/common';

import { HEALTH_CHECK_USE_CASE_PROVIDER } from '@modules/health/infrastructure/health.token';

import type {
  HealthCheckServiceInterface,
  HealthCheckServiceResponse,
  HealthCheckUseCaseInterface,
} from '../../domain/health.get.interface';

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
