import { Module } from '@nestjs/common';

import { LOG_PROVIDER } from '../../log.provider';

import { WinstonLogModule } from './implementations/winston/winston.log.module';
import { LogProvider } from './log.provider';

@Module({
  imports: [WinstonLogModule],
  providers: [
    {
      provide: LOG_PROVIDER,
      useClass: LogProvider,
    },
  ],
  exports: [LOG_PROVIDER],
})
export class SharedInfrastructureProviderLogModule {}
