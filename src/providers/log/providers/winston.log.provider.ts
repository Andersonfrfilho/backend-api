import { randomUUID } from 'crypto';
import { LogProviderInterface } from '../log.interface';

export class WinstonLogProvider implements LogProviderInterface {
  id: string;
  constructor() {
    this.id = randomUUID();
  }
  info() {
    console.log('info - ', this.id);
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
