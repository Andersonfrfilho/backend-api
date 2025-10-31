import { AppError, ErrorType } from '@common/errors/app.error';

export class AppErrorFactory {
  static validation(
    message: string,
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError({
      type: ErrorType.VALIDATION,
      message,
      statusCode: 400,
      details,
    });
  }

  static authentication(message = 'Unauthorized'): AppError {
    return new AppError({
      type: ErrorType.AUTHENTICATION,
      message,
      statusCode: 401,
    });
  }

  static authorization(message = 'Forbidden'): AppError {
    return new AppError({
      type: ErrorType.AUTHORIZATION,
      message,
      statusCode: 403,
    });
  }

  static notFound(
    message: string,
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError({
      type: ErrorType.NOT_FOUND,
      message,
      statusCode: 404,
      details,
    });
  }

  static conflict(
    message: string,
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError({
      type: ErrorType.CONFLICT,
      message,
      statusCode: 409,
      details,
    });
  }

  static businessLogic(
    message: string,
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError({
      type: ErrorType.BUSINESS_LOGIC,
      message,
      statusCode: 422,
      details,
    });
  }

  static internalServer(message = 'Internal Server Error'): AppError {
    return new AppError({
      type: ErrorType.INTERNAL_SERVER,
      message,
      statusCode: 500,
    });
  }

  static fromValidationErrors(errors: unknown[]): AppError {
    const details = {
      validationErrors: errors,
      count: Array.isArray(errors) ? errors.length : 1,
    };

    return this.validation('Validation failed', details);
  }
}
