import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import type {
  WinstonLogProviderInterface,
  LogsParams,
} from './winston.log.provider.interface';
import { requestContext } from '@app/core/context/request-context';

export class WinstonLogProvider implements WinstonLogProviderInterface {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerWinston: WinstonLogProviderInterface,
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
