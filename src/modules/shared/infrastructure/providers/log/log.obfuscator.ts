import { ObfuscatorInfoItemsParams } from './log.interface';

export const OBFUSCATOR_FIELDS: Array<ObfuscatorInfoItemsParams> = [
  {
    field: 'password',
    pattern: () => '***',
  },
  {
    field: 'oldPassword',
    pattern: () => '***',
  },
  {
    field: 'newPassword',
    pattern: () => '***',
  },
  {
    field: 'accessToken',
    pattern: () => '***',
  },
  {
    field: 'refreshToken',
    pattern: () => '***',
  },
  {
    field: 'authorization',
    pattern: () => '***',
  },
  { field: 'authToken', pattern: () => '***' },
  {
    field: 'secret',
    pattern: () => '***',
  },
  {
    field: 'phoneNumber',
    pattern: (param: string | number) => {
      const str = String(param);
      return (
        str.substring(0, 3) +
        str.substring(3, str.length - 2).replaceAll(/./g, '*') +
        str.substring(str.length - 2)
      );
    },
  },
];

export const OBFUSCATOR_REPLACEMENT = '****';
export const OBFUSCATOR_PARTIAL_INFO = '***';
