import { Inject, Injectable } from '@nestjs/common';

import { WinstonLogProvider } from '@modules/shared/infrastructure/providers/log/implementations/winston/winston.log.provider';
import { WINSTON_LOG_PROVIDER } from '@modules/shared/infrastructure/providers/log/implementations/winston/winston.log.provider.interface';
import type {
  LogBaseParams,
  LogProviderInterface,
  ObfuscatorInfoParams,
} from '@modules/shared/infrastructure/providers/log/log.interface';
import { obfuscatorInfo } from '@modules/shared/infrastructure/providers/log/log.utils';

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
      level: 'info',
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
      level: 'error',
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
      level: 'warn',
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
      level: 'debug',
      message,
      context,
      metadata: { ...(newRest as LogBaseParams) },
    } as unknown as LogBaseParams;
    this.winstonLogProvider.debug(logParams);
  }
}
