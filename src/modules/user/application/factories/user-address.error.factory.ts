import { BaseErrorFactory } from '@modules/error/application/factories';

export enum UserAddressErrorCode {
  NOT_FOUND = 'USER_ADDRESS_NOT_FOUND',
  INVALID_COMBINATION = 'INVALID_USER_ADDRESS_COMBINATION',
}

const USER_ADDRESS_ERROR_CONFIGS = {
  notFound: (userAddressId?: string) => ({
    message: 'User address not found',
    code: UserAddressErrorCode.NOT_FOUND,
    details: { userAddressId },
  }),

  invalidCombination: (userId?: string, addressId?: string) => ({
    message: 'Invalid user and address combination',
    code: UserAddressErrorCode.INVALID_COMBINATION,
    details: { userId, addressId },
  }),
} as const;

export class UserAddressErrorFactory extends BaseErrorFactory {
  static notFound(userAddressId?: string) {
    return this.createNotFound(USER_ADDRESS_ERROR_CONFIGS.notFound(userAddressId));
  }

  static invalidCombination(userId?: string, addressId?: string) {
    return this.createValidation(USER_ADDRESS_ERROR_CONFIGS.invalidCombination(userId, addressId));
  }
}
