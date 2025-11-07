import path from 'node:path';

import { Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { WINSTON_LOG_PROVIDER } from '@app/modules/shared/infrastructure/log.provider';

import { WinstonLogProvider } from './winston.log.provider';

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
                const requestId = JSON.stringify(info.requestId);
                const message = JSON.stringify(info.message || '');
                info.message = `[${requestId}] ${message}`;
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
          filename: path.join(process.cwd(), 'logs', 'error.log'),
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'combined.log'),
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: WINSTON_LOG_PROVIDER,
      useClass: WinstonLogProvider,
    },
  ],
  exports: [WINSTON_LOG_PROVIDER],
})
export class WinstonLogModule {}
