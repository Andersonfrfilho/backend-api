import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { WinstonLogProviderInterface } from './winston.log.provider.interface';
import type { LogsParams } from '@core/providers/log/implementations/winston/winton.log.types.ts';
import { requestContext } from '@app/core/context/request-context';

export class WinstonLogProvider implements WinstonLogProviderInterface {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerWinston: WinstonLogger,
  ) {}
  debug: (params?: string | object) => void;

  private getRequestId(): string {
    const store = requestContext.getStore();
    return store?.requestId || '';
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
