import type { LogProviderInterface } from '@core/providers/log/log.interface';

export const WINSTON_LOG_PROVIDER = 'WINSTON_LOG_PROVIDER';

export interface WinstonLogProviderInterface extends LogProviderInterface {}

export interface LogsParams {
  message?: string;
  context?: string;
  [key: string]: any;
}
