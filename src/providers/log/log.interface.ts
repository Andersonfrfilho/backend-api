export const LOG_PROVIDER = 'LOG_PROVIDER';

export interface LogProviderInterface {
  info: (params?: string | object) => void;
  error: (params?: string | object) => void;
  warn: (params?: string | object) => void;
  debug: (params?: string | object) => void;
  setRequestId: (requestId: string) => void;
}
