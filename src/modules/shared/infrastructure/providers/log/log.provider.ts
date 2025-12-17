import { Inject, Injectable } from '@nestjs/common';

import { LOG_LEVEL, LogBaseParams, LogProviderInterface } from '@app/modules/shared/domain';
import { WinstonLogProvider } from '@modules/shared/infrastructure/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/implementations/winston/winston.log.token';
import { obfuscatorInfo } from '@modules/shared/infrastructure/providers/log/log.utils';

import { ObfuscatorInfoParams } from './log.interface';

@Injectable()
export class LogProvider implements LogProviderInterface {
  constructor(
    @Inject(WINSTON_LOG_PROVIDER)
    private readonly winstonLogProvider: WinstonLogProvider,
  ) {}

  info(params: LogBaseParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(rest as unknown as ObfuscatorInfoParams);
    const logParams = {
      level: LOG_LEVEL.INFO,
      message,
      context,
      metadata: { ...(newRest as LogBaseParams) },
    } as unknown as LogBaseParams;
    this.winstonLogProvider.info(logParams);
  }
  error(params: LogBaseParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(rest as unknown as ObfuscatorInfoParams);
    const logParams = {
      level: LOG_LEVEL.ERROR,
      message,
      context,
      metadata: { ...(newRest as LogBaseParams) },
    } as unknown as LogBaseParams;
    this.winstonLogProvider.error(logParams);
  }
  warn(params: LogBaseParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(rest as unknown as ObfuscatorInfoParams);
    const logParams = {
      level: LOG_LEVEL.WARN,
      message,
      context,
      metadata: { ...(newRest as LogBaseParams) },
    } as unknown as LogBaseParams;
    this.winstonLogProvider.warn(logParams);
  }
  debug(params: LogBaseParams) {
    const { message, context, ...rest } = params;
    const newRest: unknown = obfuscatorInfo(rest as unknown as ObfuscatorInfoParams);
    const logParams = {
      level: LOG_LEVEL.DEBUG,
      message,
      context,
      metadata: { ...(newRest as LogBaseParams) },
    } as unknown as LogBaseParams;
    this.winstonLogProvider.debug(logParams);
  }
}
