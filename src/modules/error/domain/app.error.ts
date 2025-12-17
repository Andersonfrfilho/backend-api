export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
}

export interface AppErrorPayload {
  type: ErrorType;
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;
  public requestId?: string;

  constructor(payload: AppErrorPayload) {
    super(payload.message);
    this.name = 'AppError';
    this.type = payload.type;
    this.statusCode = payload.statusCode;
    this.code = payload.code;
    this.details = payload.details;
    this.timestamp = payload.timestamp || new Date().toISOString();
    this.requestId = payload.requestId;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
    };
  }
}
