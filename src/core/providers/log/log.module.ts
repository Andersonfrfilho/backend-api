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
console.log(process.env);
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(), // Mantém +13s
            winston.format((info) => {
              // Prependa requestId à mensagem se existir
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
                processId: true, // Desabilita PID
                appName: true, // Desabilita [NestWinston] ou nome da app
              },
            ),
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
