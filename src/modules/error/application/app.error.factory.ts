import { HttpStatus } from '@nestjs/common';

import { AppError, ErrorType } from '@modules/error/domain/app.error';
import type {
  AuthenticationErrorConfig,
  AuthorizationErrorConfig,
  BusinessLogicErrorConfig,
  ConflictErrorConfig,
  ErrorConfig,
  NotFoundErrorConfig,
  RateLimitErrorConfig,
} from '@modules/error/domain/configs';
import { DEFAULT_ERROR_MESSAGES } from '@modules/error/domain/constants';

export class AppErrorFactory {
  static validation(config: ErrorConfig): AppError {
    return new AppError({
      type: ErrorType.VALIDATION,
      message: config.message,
      statusCode: HttpStatus.BAD_REQUEST,
      details: config.details,
    });
  }

  static authentication(config: AuthenticationErrorConfig): AppError {
    return new AppError({
      type: ErrorType.AUTHENTICATION,
      message: config.message,
      statusCode: HttpStatus.UNAUTHORIZED,
      code: config.code,
    });
  }

  static authorization(config: AuthorizationErrorConfig): AppError {
    return new AppError({
      type: ErrorType.AUTHORIZATION,
      message: config.message,
      statusCode: HttpStatus.FORBIDDEN,
      code: config.code,
    });
  }

  static notFound(config: NotFoundErrorConfig): AppError {
    return new AppError({
      type: ErrorType.NOT_FOUND,
      message: config.message,
      statusCode: HttpStatus.NOT_FOUND,
      details: {
        code: config.code,
        ...config.details,
      },
    });
  }

  static conflict(config: ConflictErrorConfig): AppError {
    return new AppError({
      type: ErrorType.CONFLICT,
      message: config.message,
      statusCode: HttpStatus.CONFLICT,
      code: config.code,
      details: config.details,
    });
  }

  static businessLogic(config: BusinessLogicErrorConfig): AppError {
    return new AppError({
      type: ErrorType.BUSINESS_LOGIC,
      message: config.message,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      details: {
        code: config.code,
        ...config.details,
      },
    });
  }

  static rateLimit(config: RateLimitErrorConfig): AppError {
    return new AppError({
      type: ErrorType.BUSINESS_LOGIC,
      message: config.message,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      code: config.code,
      details: config.details,
    });
  }

  static internalServer(config?: ErrorConfig): AppError {
    return new AppError({
      type: ErrorType.INTERNAL_SERVER,
      message: config?.message || DEFAULT_ERROR_MESSAGES.INTERNAL_SERVER,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  static fromValidationErrors(errors: unknown[]): AppError {
    const validationErrors = Array.isArray(errors)
      ? errors.map((error: any) => ({
          field: error.property,
          constraints: error.constraints,
          children: error.children && error.children.length > 0 ? error.children : undefined,
        }))
      : [];

    const details = {
      validationErrors,
      count: validationErrors.length,
    };

    return this.validation({
      message: DEFAULT_ERROR_MESSAGES.VALIDATION_FAILED,
      details,
    });
  }
}
