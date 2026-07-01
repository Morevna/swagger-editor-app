import { describe, it, expect } from 'vitest';
import { detectFormat, parseSchema } from './editor-utils';

describe('SwaggerEditor Utils', () => {
  it('should correctly detect JSON format', () => {
    const jsonText = '{"openapi": "3.0.0"}';
    expect(detectFormat(jsonText)).toBe('json');
  });

  it('should correctly detect YAML format', () => {
    const yamlText = 'openapi: 3.0.0';
    expect(detectFormat(yamlText)).toBe('yaml');
  });

  it('should return error for invalid JSON', () => {
    const invalidJson = '{invalid}';
    const result = parseSchema(invalidJson);
    expect(result.error).toBe('PARSE_ERROR');
  });
});
