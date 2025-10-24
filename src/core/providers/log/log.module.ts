import { Module, Scope } from '@nestjs/common';
import { LOG_PROVIDER } from '@core/providers/log/log.interface';
import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { LogProvider } from './log.provider';

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
      scope: Scope.REQUEST,
    },
  ],
  exports: [LOG_PROVIDER],
})
export class LogModule {}
