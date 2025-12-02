import { BaseErrorFactory } from '@modules/error/application/factories';
import { USER_ERROR_CONFIGS } from '@modules/error/domain/configs';

export class UserErrorFactory extends BaseErrorFactory {
  static duplicateEmail(email: string) {
    return this.createConflict(USER_ERROR_CONFIGS.duplicateEmail(email));
  }

  static duplicateCpf(cpf: string) {
    return this.createConflict(USER_ERROR_CONFIGS.duplicateCpf(cpf));
  }

  static duplicateRg(rg: string) {
    return this.createConflict(USER_ERROR_CONFIGS.duplicateRg(rg));
  }

  static notFound(userId?: string) {
    return this.createNotFound(USER_ERROR_CONFIGS.notFound(userId));
  }

  static invalidPassword() {
    return this.createBusinessLogic(USER_ERROR_CONFIGS.invalidPassword());
  }

  static accountDisabled(userId: string) {
    return this.createBusinessLogic(USER_ERROR_CONFIGS.accountDisabled(userId));
  }

  static emailNotVerified(email: string) {
    return this.createBusinessLogic(USER_ERROR_CONFIGS.emailNotVerified(email));
  }

  static invalidUserType(type: string) {
    return this.createBusinessLogic(USER_ERROR_CONFIGS.invalidUserType(type));
  }
}
