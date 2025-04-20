export interface LogProviderInterface {
  info: () => void;
  error: () => void;
  warn: () => void;
  debug: () => void;
}
