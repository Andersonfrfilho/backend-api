import { OBFUSCATOR_FIELDS } from '@modules/shared/infrastructure/providers/log/log.obfuscator';

import { ObfuscatorInfoParams } from './log.interface';

export const isPrimitive = (v: unknown) =>
  v === null ||
  typeof v === 'string' ||
  typeof v === 'number' ||
  typeof v === 'boolean' ||
  typeof v === 'undefined' ||
  typeof v === 'function';

export const isDate = (v: unknown) => v instanceof Date;

export const obfuscatorInfo = ({
  params,
  fields = OBFUSCATOR_FIELDS,
}: ObfuscatorInfoParams): unknown => {
  if (isPrimitive(params) || isDate(params)) {
    return params;
  }

  if (Array.isArray(params)) {
    return params.map((item) => obfuscatorInfo({ params: item, fields }));
  }

  if (typeof params === 'object' && params !== null) {
    const obj = params as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    const lowerToPattern = new Map<string, (p: string | number | undefined) => string>();

    for (const f of fields) {
      lowerToPattern.set(f.field.toLowerCase(), f.pattern);
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const lowerKey = key.toLowerCase();

      if (lowerToPattern.has(lowerKey)) {
        const pattern = lowerToPattern.get(lowerKey)!;
        try {
          if (value === null || value === undefined) {
            result[key] = pattern(undefined);
          } else if (typeof value === 'number') {
            result[key] = pattern(value);
          } else {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            result[key] = pattern(stringValue);
          }
        } catch {
          result[key] = '***';
        }
      } else {
        result[key] = obfuscatorInfo({ params: value, fields });
      }
    }

    return result;
  }

  return params;
};
