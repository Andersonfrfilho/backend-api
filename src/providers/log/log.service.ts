import { Inject, Injectable } from '@nestjs/common';
import { LogProviderInterface } from './log.interface';
import { WinstonLogProvider } from './providers/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from './providers/winston.log.provider.interface';

@Injectable()
export class LogProvider implements LogProviderInterface {
  constructor(
    @Inject(WINSTON_LOG_PROVIDER)
    private winstonLogProvider: WinstonLogProvider,
  ) {}
  info() {
    this.winstonLogProvider.info();
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
