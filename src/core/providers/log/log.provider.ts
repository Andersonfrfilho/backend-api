import { Inject, Injectable } from '@nestjs/common';
import { LogProviderInterface } from '@core/providers/log/log.interface';
import { WinstonLogProvider } from '@core/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@core/providers/log/implementations/winston/winston.log.provider.interface';
import type {
  LogsDebugParams,
  LogsErrorParams,
  LogsInfoParams,
  LogsWarnParams,
} from '@core/providers/log/log.types';
import {
  obfuscatorInfo,
  ObfuscatorInfoParams,
} from '@core/providers/log/log.utils';

@Injectable()
export class LogProvider implements LogProviderInterface {
  constructor(
    @Inject(WINSTON_LOG_PROVIDER)
    private readonly winstonLogProvider: WinstonLogProvider,
  ) {}
  setRequestId(requestId: string) {
    this.winstonLogProvider.setRequestId(requestId);
  }
  info(params: LogsInfoParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(
      rest as unknown as ObfuscatorInfoParams,
    );
    const logParams = {
      level: 'info',
      message,
      context,
      ...(newRest as LogsInfoParams),
    } as unknown as LogsInfoParams;
    this.winstonLogProvider.info(logParams);
  }
  error(params: LogsErrorParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(
      rest as unknown as ObfuscatorInfoParams,
    );
    const logParams = {
      level: 'error',
      message,
      context,
      ...(newRest as LogsErrorParams),
    } as unknown as LogsErrorParams;
    this.winstonLogProvider.error(logParams);
  }
  warn(params: LogsWarnParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(
      rest as unknown as ObfuscatorInfoParams,
    );
    const logParams = {
      level: 'warn',
      message,
      context,
      ...(newRest as LogsWarnParams),
    } as unknown as LogsWarnParams;
    this.winstonLogProvider.warn(logParams);
  }
  debug(params: LogsDebugParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(
      rest as unknown as ObfuscatorInfoParams,
    );
    const logParams = {
      level: 'debug',
      message,
      context,
      ...(newRest as LogsDebugParams),
    } as unknown as LogsDebugParams;
    this.winstonLogProvider.debug(logParams);
  }
}
