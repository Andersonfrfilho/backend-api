import type { LogLevel } from '../enums/log.enum';

export interface LogBaseParams {
  message: string;
  context?: string;
  params?: unknown;
  requestId?: string;
}

export interface LogContext {
  level: LogLevel;
  context: string;
  timestamp: Date;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export interface LogProviderInterface {
  info(params?: LogBaseParams): void;
  error(params?: LogBaseParams): void;
  warn(params?: LogBaseParams): void;
  debug(params?: LogBaseParams): void;
}
