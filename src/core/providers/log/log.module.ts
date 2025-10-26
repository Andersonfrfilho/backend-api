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
import path from 'node:path';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            winston.format((info) => {
              if (info.requestId) {
                info.message = `[${info.requestId}] ${info.message || ''}`;
              }
              return info;
            })(),
            nestWinstonModuleUtilities.format.nestLike(
              process.env.PROJECT_NAME || 'NestWinstonApp',
              {
                colors: true,
                prettyPrint: true,
                processId: true,
                appName: true,
              },
            ),
          ),
        }),
        new winston.transports.File({
          filename: path.join(__dirname, '../../../../../logs/error.log'),
        }),
        new winston.transports.File({
          filename: path.join(__dirname, '../../../../../logs/combined.log'),
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
