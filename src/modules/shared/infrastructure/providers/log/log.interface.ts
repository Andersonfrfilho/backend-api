import type { LogsParams } from './implementations/winston/winston.log.provider.interface';
import type { ObfuscatorInfoItemsParams } from './log.obfuscator';

export const LOG_PROVIDER = 'LOG_PROVIDER';

export interface LogProviderInterface {
  info: (params?: string | object) => void;
  error: (params?: string | object) => void;
  warn: (params?: string | object) => void;
  debug: (params?: string | object) => void;
}

export interface ObfuscatorInfoParams {
  params: unknown;
  fields?: ObfuscatorInfoItemsParams[];
}

export interface LogsInfoParams extends LogsParams {}
export interface LogsErrorParams extends LogsParams {}
export interface LogsWarnParams extends LogsParams {}
export interface LogsDebugParams extends LogsParams {}
