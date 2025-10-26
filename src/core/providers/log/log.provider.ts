import { Inject, Injectable } from '@nestjs/common';
import { LogProviderInterface } from '@core/providers/log/log.interface';
import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';
import type {
  LogsDebugParams,
  LogsErrorParams,
  LogsInfoParams,
  LogsWarnParams,
} from '@core/providers/log/log.types';

@Injectable()
export class LogProvider implements LogProviderInterface {
  constructor(
    @Inject(WINSTON_LOG_PROVIDER)
    private readonly winstonLogProvider: WinstonLogProvider,
  ) {}
  setRequestId(requestId: string) {
    this.winstonLogProvider.setRequestId(requestId);
  }
  info(params: LogsInfoParams) {
    this.winstonLogProvider.info(params);
  }
  error(params: LogsErrorParams) {
    this.winstonLogProvider.error(params);
  }
  warn(params: LogsWarnParams) {
    this.winstonLogProvider.warn(params);
  }
  debug(params: LogsDebugParams) {
    this.winstonLogProvider.debug(params);
  }
}
