import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { SchemaFormat } from '../stores/editorStore';

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

export const validateSchema = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') {
    return 'Invalid OpenAPI structure';
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
