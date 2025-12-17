import { BaseErrorFactory } from '@modules/error/application/factories/base.error.factory';
import { METHOD_NOT_IMPLEMENTED_ERROR_CONFIGS } from '@modules/error/domain/configs';

export class MethodNotImplementedErrorFactory extends BaseErrorFactory {
  static methodNotImplemented(methodName?: string) {
    return this.createBusinessLogic(
      METHOD_NOT_IMPLEMENTED_ERROR_CONFIGS.methodNotImplemented(methodName),
    );
  }
}
