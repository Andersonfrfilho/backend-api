import { PhoneErrorFactory } from '@modules/phone/application/factories/phone.error.factory';
import {
  PHONE_AREA_END,
  PHONE_AREA_START,
  PHONE_COUNTRY_END,
  PHONE_COUNTRY_START,
  PHONE_NUMBER_START,
  PHONE_TOTAL_LENGTH,
} from '@modules/user/application/constants/phone.constant';
import type { ParsedPhone } from '@modules/user/application/interfaces/phone.interface';

export const parsePhone = (phone: string): ParsedPhone => {
  const clean = phone.replace(/\D/g, '');

  if (clean.length !== PHONE_TOTAL_LENGTH) {
    throw PhoneErrorFactory.invalidFormat(phone);
  }

  return {
    country: `+${clean.substring(PHONE_COUNTRY_START, PHONE_COUNTRY_END)}`,
    area: clean.substring(PHONE_AREA_START, PHONE_AREA_END),
    number: clean.substring(PHONE_NUMBER_START),
  };
};
