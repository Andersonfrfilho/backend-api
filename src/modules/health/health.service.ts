import { Injectable } from '@nestjs/common';
import {
  HealthCheckMethodServiceResponse,
  HealthCheckServiceInterface,
} from './health.service.interfaces';

@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  healthCheck(): HealthCheckMethodServiceResponse {
    return {
      status: true,
    };
  }
}
