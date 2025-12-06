import { BaseErrorFactory } from '@modules/error/application/factories';

export enum AddressErrorCode {
  NOT_FOUND = 'ADDRESS_NOT_FOUND',
  INVALID_COORDINATES = 'INVALID_ADDRESS_COORDINATES',
}

const ADDRESS_ERROR_CONFIGS = {
  notFound: (addressId?: string) => ({
    message: 'Address not found',
    code: AddressErrorCode.NOT_FOUND,
    details: { addressId },
  }),

  invalidCoordinates: (latitude?: number, longitude?: number) => ({
    message: 'Invalid address coordinates',
    code: AddressErrorCode.INVALID_COORDINATES,
    details: { latitude, longitude },
  }),
} as const;

export class AddressErrorFactory extends BaseErrorFactory {
  static notFound(addressId?: string) {
    return this.createNotFound(ADDRESS_ERROR_CONFIGS.notFound(addressId));
  }

  static invalidCoordinates(latitude?: number, longitude?: number) {
    return this.createValidation(ADDRESS_ERROR_CONFIGS.invalidCoordinates(latitude, longitude));
  }
}
