import { Injectable } from '@nestjs/common';

import type {
  HealthCheckServiceResponse,
  HealthCheckUseCaseInterface,
} from '../../domain/health.get.interface';

@Injectable()
export class HealthCheckUseCase implements HealthCheckUseCaseInterface {
  constructor() {}
  execute(): HealthCheckServiceResponse {
    return {
      status: true,
      message: 'Health check passed',
    };
  }
}
