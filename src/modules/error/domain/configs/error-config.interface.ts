import type { ErrorCode } from '@modules/error/domain/error-codes';

export interface ErrorConfig {
  message: string;
  code?: ErrorCode;
  details?: Record<string, unknown>;
}

export interface ConflictErrorConfig extends ErrorConfig {
  code: ErrorCode;
}

export interface NotFoundErrorConfig extends ErrorConfig {
  code: ErrorCode;
}

export interface BusinessLogicErrorConfig extends ErrorConfig {
  code: ErrorCode;
}

export interface AuthenticationErrorConfig extends ErrorConfig {
  code: ErrorCode;
}

export interface AuthorizationErrorConfig extends ErrorConfig {
  code?: ErrorCode;
}

export interface RateLimitErrorConfig extends ErrorConfig {
  code: ErrorCode;
  details?: Record<string, unknown> & { retryAfter?: number };
}
