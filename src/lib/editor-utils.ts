import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export type SchemaFormat = 'json' | 'yaml';

export const detectFormat = (text: string): SchemaFormat => {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[') ? 'json' : 'yaml';
};

export interface ParseResult<T = unknown> {
  data: T | null;
  error: string | null;
}

export const parseSchema = <T = unknown>(text: string): ParseResult<T> => {
  const format = detectFormat(text);
  try {
    if (format === 'json') {
      return { data: JSON.parse(text) as T, error: null };
    }
    return { data: parseYaml(text) as T, error: null };
  } catch {
    return { data: null, error: 'PARSE_ERROR' };
  }
};

export type ValidationErrorCode =
  | 'NOT_AN_OBJECT'
  | 'MISSING_OPENAPI_VERSION'
  | 'MISSING_INFO'
  | 'MISSING_PATHS';

export const validateSchema = (data: unknown): ValidationErrorCode | null => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'NOT_AN_OBJECT';
  }
  const schema = data as Record<string, unknown>;
  if (!schema.openapi && !schema.swagger) {
    return 'MISSING_OPENAPI_VERSION';
  }
  if (!schema.info || typeof schema.info !== 'object') {
    return 'MISSING_INFO';
  }
  if (!schema.paths || typeof schema.paths !== 'object') {
    return 'MISSING_PATHS';
  }
  return null;
};

export const convertFormat = (
  text: string
): { success: boolean; result: string; newLang: SchemaFormat } => {
  const currentLang = detectFormat(text);
  try {
    if (currentLang === 'json') {
      const obj = JSON.parse(text);
      return { success: true, result: stringifyYaml(obj), newLang: 'yaml' };
    }
    const obj = parseYaml(text);
    return { success: true, result: JSON.stringify(obj, null, 2), newLang: 'json' };
  } catch {
    return { success: false, result: text, newLang: currentLang };
  }
};
