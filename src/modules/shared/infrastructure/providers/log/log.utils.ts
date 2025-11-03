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

type PatternFn = (p: string | number | undefined) => string;

const applyPattern = (value: unknown, pattern: PatternFn): string => {
  try {
    if (value === null || value === undefined) {
      return pattern(undefined);
    }
    if (typeof value === 'number') {
      return pattern(value);
    }
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    return pattern(stringValue);
  } catch {
    return '***';
  }
};

const processValue = (
  value: unknown,
  pattern: PatternFn | undefined,
  fields: typeof OBFUSCATOR_FIELDS,
): unknown => {
  if (pattern !== undefined) {
    return Array.isArray(value)
      ? value.map((item) => applyPattern(item, pattern))
      : applyPattern(value, pattern);
  }
  return obfuscatorInfo({ params: value, fields });
};

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
    const patternMap = new Map<string, PatternFn>();

    for (const f of fields) {
      patternMap.set(f.field.toLowerCase(), f.pattern);
    }

    for (const key of Object.keys(obj)) {
      const pattern = patternMap.get(key.toLowerCase());
      result[key] = processValue(obj[key], pattern, fields);
    }

    return result;
  }

  return params;
};
