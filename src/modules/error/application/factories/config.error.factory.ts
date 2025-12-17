import { BaseErrorFactory } from '@modules/error/application/factories/base.error.factory';
import { CONFIG_ERROR_CONFIGS } from '@modules/error/domain/configs';

export class ConfigErrorFactory extends BaseErrorFactory {
  static invalidConfiguration(details?: string) {
    return this.createBusinessLogic(CONFIG_ERROR_CONFIGS.invalidConfiguration(details));
  }
}
