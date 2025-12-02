/**
 * Phone constants
 */

// Comprimento esperado para telefone brasileiro: +55 (2) + 99 (2) + 9 dígitos
export const PHONE_COUNTRY_CODE_LENGTH = 2;
export const PHONE_AREA_CODE_LENGTH = 2;
export const PHONE_NUMBER_LENGTH = 9;
export const PHONE_TOTAL_LENGTH =
  PHONE_COUNTRY_CODE_LENGTH + PHONE_AREA_CODE_LENGTH + PHONE_NUMBER_LENGTH; // 13
export const PHONE_WITH_PLUS_LENGTH = PHONE_TOTAL_LENGTH + 1; // 14 (+55 + 2 dígitos área + 9 dígitos número)

// Índices para substring
export const PHONE_COUNTRY_START = 0;
export const PHONE_COUNTRY_END = 2;
export const PHONE_AREA_START = 2;
export const PHONE_AREA_END = 4;
export const PHONE_NUMBER_START = 4;
