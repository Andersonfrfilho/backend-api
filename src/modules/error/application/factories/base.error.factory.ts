import { AppErrorFactory } from '@modules/error/application/app.error.factory';
import type { AppError } from '@modules/error/domain/app.error';
import type {
  AuthenticationErrorConfig,
  AuthorizationErrorConfig,
  BusinessLogicErrorConfig,
  ConflictErrorConfig,
  ErrorConfig,
  NotFoundErrorConfig,
  RateLimitErrorConfig,
} from '@modules/error/domain/configs';

export abstract class BaseErrorFactory {
  protected static createConflict(config: ConflictErrorConfig): AppError {
    return AppErrorFactory.conflict(config);
  }

  protected static createNotFound(config: NotFoundErrorConfig): AppError {
    return AppErrorFactory.notFound(config);
  }

  protected static createBusinessLogic(config: BusinessLogicErrorConfig): AppError {
    return AppErrorFactory.businessLogic(config);
  }

  protected static createAuthentication(config: AuthenticationErrorConfig): AppError {
    return AppErrorFactory.authentication(config);
  }

  protected static createAuthorization(config: AuthorizationErrorConfig): AppError {
    return AppErrorFactory.authorization(config);
  }

  protected static createValidation(config: ErrorConfig): AppError {
    return AppErrorFactory.validation(config);
  }

  protected static createRateLimit(config: RateLimitErrorConfig): AppError {
    return AppErrorFactory.rateLimit(config);
  }
}
