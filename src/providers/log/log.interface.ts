export const LOG_PROVIDER = 'LOG_PROVIDER';

export interface LogProviderInterface {
  info: () => void;
  error: () => void;
  warn: () => void;
  debug: () => void;
}
