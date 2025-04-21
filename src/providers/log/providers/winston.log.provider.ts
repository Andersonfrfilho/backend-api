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
  info() {
    this.loggerWinston.log(`info %%%%%%%%%%% ${this.id}`);
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
