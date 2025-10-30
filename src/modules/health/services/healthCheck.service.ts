import { Injectable } from '@nestjs/common';
import {
  HealthCheckMethodServiceResponse,
  HealthCheckServiceInterface,
} from '@modules/health/health.interfaces';
@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  execute(): HealthCheckMethodServiceResponse {
    return {
      status: true,
      message: 'Health check passed',
    };
  }
}
