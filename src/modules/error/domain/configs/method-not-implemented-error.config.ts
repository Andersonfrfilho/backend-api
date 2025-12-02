import type { BusinessLogicErrorConfig } from '@modules/error/domain/configs/error-config.interface';
import { MethodNotImplementedErrorCode } from '@modules/error/domain/error-codes';

export const METHOD_NOT_IMPLEMENTED_ERROR_CONFIGS = {
  methodNotImplemented: (methodName?: string): BusinessLogicErrorConfig => ({
    message: `Method not implemented${methodName ? `: ${methodName}` : ''}`,
    code: MethodNotImplementedErrorCode.METHOD_NOT_IMPLEMENTED,
    details: { methodName },
  }),
} as const;
