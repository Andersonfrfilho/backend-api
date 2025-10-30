import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckMethodResponse,
  HealthCheckServiceInterface,
} from './health.service.interfaces';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import type { LogProviderInterface } from '@core/providers/log/log.interface';
@Injectable()
export class HealthCheckService implements HealthCheckServiceInterface {
  async healthCheck(): Promise<HealthCheckMethodResponse> {
    throw new ForbiddenException();
  }
  @Inject(LOG_PROVIDER) private readonly logProvider: LogProviderInterface;
  // async healthCheck(): Promise<HealthCheckMethodServiceResponse> {
  //   this.logProvider.info('service');
  //   throw new ForbiddenException();
  //   // return {
  //   //   status: true,
  //   // };
  // }
}
