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
    pattern: (param: string) =>
      param.substring(0, 3) +
      param.substring(3, param.length - 2).replace(/./g, '*') +
      param.substring(param.length - 2),
  },
];

export const OBFUSCATOR_REPLACEMENT = '****';
export const OBFUSCATOR_PARTIAL_INFO = '***';
