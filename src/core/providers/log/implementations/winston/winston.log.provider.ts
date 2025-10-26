import { randomUUID } from 'node:crypto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { WinstonLogProviderInterface } from './winston.log.provider.interface';
import type { LogsParams } from '@core/providers/log/implementations/winston/winton.log.types.ts';

export class WinstonLogProvider implements WinstonLogProviderInterface {
  id: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerWinston: WinstonLogger,
  ) {
    this.id = randomUUID();
  }
  debug: (params?: string | object) => void;
  setRequestId(requestId: string) {
    this.id = requestId;
  }

  info(params: LogsParams) {
    this.loggerWinston.log({
      ...params,
      requestId: this.id,
    });
  }

  error(params: LogsParams) {
    this.loggerWinston.error({
      ...params,
      requestId: this.id,
    });
  }

  warn(params: LogsParams) {
    this.loggerWinston.warn({
      ...params,
      requestId: this.id,
    });
  }
}
