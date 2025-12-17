import type { BusinessLogicErrorConfig } from '@modules/error/domain/configs/error-config.interface';
import { ConfigErrorCode } from '@modules/error/domain/error-codes';

export const CONFIG_ERROR_CONFIGS = {
  invalidConfiguration: (details?: string): BusinessLogicErrorConfig => ({
    message: `Invalid configuration: ${details || 'Configuration validation failed'}`,
    code: ConfigErrorCode.INVALID_CONFIGURATION,
    details: { configDetails: details },
  }),
} as const;
