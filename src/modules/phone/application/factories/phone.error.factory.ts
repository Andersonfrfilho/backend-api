import { BaseErrorFactory } from '@modules/error/application/factories';

export enum PhoneErrorCode {
  INVALID_FORMAT = 'INVALID_PHONE_FORMAT',
  NOT_FOUND = 'PHONE_NOT_FOUND',
}

const PHONE_ERROR_CONFIGS = {
  invalidFormat: (phone?: string) => ({
    message: `Invalid phone format${phone ? `: ${phone}` : ''}`,
    code: PhoneErrorCode.INVALID_FORMAT,
    details: { phone },
  }),

  notFound: (phoneId?: string) => ({
    message: 'Phone not found',
    code: PhoneErrorCode.NOT_FOUND,
    details: { phoneId },
  }),
} as const;

export class PhoneErrorFactory extends BaseErrorFactory {
  static invalidFormat(phone?: string) {
    return this.createValidation(PHONE_ERROR_CONFIGS.invalidFormat(phone));
  }

  static notFound(phoneId?: string) {
    return this.createNotFound(PHONE_ERROR_CONFIGS.notFound(phoneId));
  }
}
