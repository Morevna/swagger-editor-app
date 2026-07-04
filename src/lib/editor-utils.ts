import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export type SchemaFormat = 'json' | 'yaml';
export const detectFormat = (text: string): SchemaFormat => {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }
  return 'yaml';
};

export interface ParseResult {
  data: unknown;
  error: string | null;
}

export const parseSchema = (text: string): ParseResult => {
  const format = detectFormat(text);
  try {
    if (format === 'json') {
      return { data: JSON.parse(text), error: null };
    } else {
      return { data: parseYaml(text), error: null };
    }
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
  text: string,
  currentLang: SchemaFormat
): { success: boolean; result: string; newLang: SchemaFormat } => {
  try {
    if (currentLang === 'json') {
      const obj = JSON.parse(text);
      const yamlResult = stringifyYaml(obj);
      return { success: true, result: yamlResult, newLang: 'yaml' };
    } else {
      const obj = parseYaml(text);
      const jsonResult = JSON.stringify(obj, null, 2);
      return { success: true, result: jsonResult, newLang: 'json' };
    }
  } catch {
    return {
      success: false,
      result: text,
      newLang: currentLang,
    };
  }
};
