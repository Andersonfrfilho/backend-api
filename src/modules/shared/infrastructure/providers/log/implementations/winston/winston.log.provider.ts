import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

import { LOG_LEVEL, LogBaseParams, LogProviderInterface } from '@app/modules/shared/domain';
import { requestContext } from '@modules/shared/infrastructure/context/request-context';

export class WinstonLogProvider implements LogProviderInterface {
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

  debug(params?: LogBaseParams) {
    this.loggerWinston.log({
      ...params,
      level: LOG_LEVEL.DEBUG,
      requestId: this.getRequestId(),
    });
  }

  info(params?: LogBaseParams) {
    this.loggerWinston.log({
      ...params,
      level: LOG_LEVEL.INFO,
      requestId: this.getRequestId(),
    });
  }

  error(params?: LogBaseParams) {
    this.loggerWinston.error({
      ...params,
      requestId: this.getRequestId(),
    });
  }

  warn(params?: LogBaseParams) {
    this.loggerWinston.warn({
      ...params,
      requestId: this.getRequestId(),
    });
  }
}
