import { Inject, Injectable } from '@nestjs/common';
import { LogProviderInterface } from '@core/providers/log/log.interface';
import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';

@Injectable()
export class LogProvider implements LogProviderInterface {
  constructor(
    @Inject(WINSTON_LOG_PROVIDER)
    private readonly winstonLogProvider: WinstonLogProvider,
  ) {}
  setRequestId(requestId: string) {
    this.winstonLogProvider.setRequestId(requestId);
  }
  info(params?: any) {
    this.winstonLogProvider.info(params);
  }
  error() {
    this.winstonLogProvider.error();
  }
  warn() {
    this.winstonLogProvider.warn();
  }
  debug() {
    this.winstonLogProvider.debug();
  }
}
