import { randomUUID } from 'crypto';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { WinstonLogProviderInterface } from './winston.log.provider.interface';

export class WinstonLogProvider implements WinstonLogProviderInterface {
  id: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private loggerWinston: WinstonLogger,
  ) {
    this.id = randomUUID();
  }
  setRequestId(requestId: string) {
    console.log('##########=>id', requestId);
    this.id = requestId;
  }
  info(params?: any) {
    this.loggerWinston.log(`${params} ${this.id}`);
  }
  error() {
    console.log('error');
  }
  warn() {
    console.log('warn');
  }
  debug() {
    console.log('debug');
  }
}
