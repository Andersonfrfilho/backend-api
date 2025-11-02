import type { ObfuscatorInfoItemsParams } from './log.obfuscator';

export const LOG_PROVIDER = 'LOG_PROVIDER';
export interface LogBaseParams {
  message: string;
  context?: string;
  params?: unknown;
  requestId?: string;
}

export interface LogProviderInterface {
  info: (params?: LogBaseParams) => void;
  error: (params?: LogBaseParams) => void;
  warn: (params?: LogBaseParams) => void;
  debug: (params?: LogBaseParams) => void;
}

export interface ObfuscatorInfoParams {
  params: unknown;
  fields?: ObfuscatorInfoItemsParams[];
}
