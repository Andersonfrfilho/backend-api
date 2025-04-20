import { LogProviderInterface } from './log.interface';
import { WinstonLogProvider } from './providers/winston.log.provider';

export class LogProvider implements LogProviderInterface {
  constructor(private readonly winstonLogProvider: WinstonLogProvider) {}
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
