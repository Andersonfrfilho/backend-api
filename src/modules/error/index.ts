export { AppErrorFactory } from '@modules/error/application/app.error.factory';
export { AuthErrorFactory, UserErrorFactory } from '@modules/error/application/factories';
export { AppError, ErrorType, type AppErrorPayload } from '@modules/error/domain/app.error';
export {
  AUTH_ERROR_CONFIGS,
  USER_ERROR_CONFIGS,
  type ErrorConfig,
} from '@modules/error/domain/configs';
export { DEFAULT_ERROR_MESSAGES } from '@modules/error/domain/constants';
export { AuthErrorCode, UserErrorCode, type ErrorCode } from '@modules/error/domain/error-codes';
