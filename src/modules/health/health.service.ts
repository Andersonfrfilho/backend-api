import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckMethodResponse,
  HealthCheckMethodServiceResponse,
  HealthCheckServiceInterface,
} from './health.service.interfaces';
import {
  LOG_PROVIDER,
  LogProviderInterface,
} from 'src/providers/log/log.interface';

@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  healthCheck(): Promise<HealthCheckMethodResponse> {
    try {
      throw new Error('Method not implemented.');
    } catch (error) {
      throw error;
    }
  }
  @Inject(LOG_PROVIDER) private logProvider: LogProviderInterface;
  // async healthCheck(): Promise<HealthCheckMethodServiceResponse> {
  //   this.logProvider.info('service');
  //   throw new ForbiddenException();
  //   // return {
  //   //   status: true,
  //   // };
  // }
}
