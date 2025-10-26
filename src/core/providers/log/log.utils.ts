import {
  OBFUSCATOR_FIELDS,
  ObfuscatorInfoItemsParams,
} from '@core/providers/log/log.constant';

export interface ObfuscatorInfoParams {
  params: unknown;
  fields?: ObfuscatorInfoItemsParams[];
}

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
  // primitivas e funções: não altera
  if (isPrimitive(params) || isDate(params)) {
    return params;
  }

  // arrays: map recursivamente
  if (Array.isArray(params)) {
    return params.map((item) => obfuscatorInfo({ params: item, fields }));
  }

  // objetos: percorre todas as chaves
  if (typeof params === 'object' && params !== null) {
    const obj = params as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    const lowerToPattern = new Map<
      string,
      (p: string | number | undefined) => string
    >();

    // preparar um lookup case-insensitive
    for (const f of fields) {
      lowerToPattern.set(f.field.toLowerCase(), f.pattern);
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const lowerKey = key.toLowerCase();

      if (lowerToPattern.has(lowerKey)) {
        // aplicar pattern (garantir que pattern não quebre com undefined/null)
        const pattern = lowerToPattern.get(lowerKey)!;
        try {
          // converter números para string quando necessário; pattern aceita number|string|undefined
          if (value === null || value === undefined) {
            result[key] = pattern(undefined);
          } else if (typeof value === 'number') {
            result[key] = pattern(value);
          } else {
            result[key] = pattern(String(value));
          }
        } catch (err) {
          // fallback seguro em caso de erro na pattern
          result[key] = '***';
        }
      } else {
        // não é campo a ser obfuscado → recursão
        result[key] = obfuscatorInfo({ params: value, fields });
      }
    }

    return result;
  }

  // fallback: retorna como está
  return params;
};
