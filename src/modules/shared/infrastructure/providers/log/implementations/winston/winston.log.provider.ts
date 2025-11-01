import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { requestContext } from '@modules/shared/infrastructure/context/request-context';

import type {
  WinstonLogProviderInterface,
  LogsParams,
} from './winston.log.provider.interface';

export class WinstonLogProvider implements WinstonLogProviderInterface {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerWinston: WinstonLogger,
  ) {}

  private getRequestId(): string {
    const store = requestContext.getStore();
    if (store?.requestId) {
      return store.requestId;
    }
    return '';
  }

  debug(params: LogsParams) {
    this.loggerWinston.log({
      ...params,
      level: 'debug',
      requestId: this.getRequestId(),
    });
  }

  info(params: LogsParams) {
    this.loggerWinston.log({
      ...params,
      level: 'info',
      requestId: this.getRequestId(),
    });
  }

  error(params: LogsParams) {
    this.loggerWinston.error({
      ...params,
      requestId: this.getRequestId(),
    });
  }

  warn(params: LogsParams) {
    this.loggerWinston.warn({
      ...params,
      requestId: this.getRequestId(),
    });
  }
}
