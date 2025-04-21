import { Module, Scope } from '@nestjs/common';
import { LogProvider } from './log.service';
import { LOG_PROVIDER } from './log.interface';
import { WinstonLogProvider } from './providers/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from './providers/winston.log.provider.interface';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: WINSTON_LOG_PROVIDER,
      useClass: WinstonLogProvider,
      scope: Scope.REQUEST,
    },
    {
      provide: LOG_PROVIDER,
      useClass: LogProvider,
    },
  ],
  exports: [LOG_PROVIDER],
})
export class LogModule {}
