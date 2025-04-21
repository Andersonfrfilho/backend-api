import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckMethodServiceResponse,
  HealthCheckServiceInterface,
} from './health.service.interfaces';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from 'src/providers/log/log.interface';

@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface;
  healthCheck(): HealthCheckMethodServiceResponse {
    this.logProvider.info('service');
    return {
      status: true,
    };
  }
}
