import { describe, it, expect } from 'vitest';
import { detectFormat, parseSchema, validateSchema, convertFormat } from './editor-utils';

describe('Editor Utilities', () => {
  describe('detectFormat', () => {
    it('must correctly identify the JSON format', () => {
      const jsonText = '{ "openapi": "3.0.0" }';
      expect(detectFormat(jsonText)).toBe('json');
    });

    it('must correctly identify the YAML format', () => {
      const yamlText = 'openapi: 3.0.0';
      expect(detectFormat(yamlText)).toBe('yaml');
    });

    it('must ignore spaces and line breaks when determining the format', () => {
      const spaceJson = '   \n  { "a": 1 }';
      expect(detectFormat(spaceJson)).toBe('json');
    });
  });

  describe('parseSchema', () => {
    it('should successfully parse valid JSON', () => {
      const jsonText = '{"menu": true}';
      const result = parseSchema(jsonText);
      expect(result.error).toBeNull();
      expect(result.data).toEqual({ menu: true });
    });

    it('should successfully parse valid YAML', () => {
      const yamlText = 'menu: true';
      const result = parseSchema(yamlText);
      expect(result.error).toBeNull();
      expect(result.data).toEqual({ menu: true });
    });

    it('must return PARSE_ERROR for broken syntax', () => {
      const brokenText = '{ openapi: 3.0.0 ';
      const result = parseSchema(brokenText);
      expect(result.data).toBeNull();
      expect(result.error).toBe('PARSE_ERROR');
    });
  });

  describe('validateSchema', () => {
    it('must return null for a perfectly valid OpenAPI structure', () => {
      const validData = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      };
      expect(validateSchema(validData)).toBeNull();
    });

    it('must support the old Swagger 2.0 format', () => {
      const validSwagger2 = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      };
      expect(validateSchema(validSwagger2)).toBeNull();
    });

    it('must return NOT_AN_OBJECT if the input is not an object or an array', () => {
      expect(validateSchema('просто строка')).toBe('NOT_AN_OBJECT');
      expect(validateSchema(null)).toBe('NOT_AN_OBJECT');
      expect(validateSchema([1, 2, 3])).toBe('NOT_AN_OBJECT');
    });

    it('must return MISSING_OPENAPI_VERSION if the version field is missing', () => {
      const noVersion = {
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      };
      expect(validateSchema(noVersion)).toBe('MISSING_OPENAPI_VERSION');
    });

    it('must return MISSING_INFO if the info block is missing or empty', () => {
      const noInfo = {
        openapi: '3.0.0',
        paths: {},
      };
      expect(validateSchema(noInfo)).toBe('MISSING_INFO');
    });

    it('must return MISSING_PATHS if the paths object is missing', () => {
      const noPaths = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
      };
      expect(validateSchema(noPaths)).toBe('MISSING_PATHS');
    });
  });

  describe('convertFormat', () => {
    it('must successfully convert valid JSON into a YAML string', () => {
      const jsonText = '{\n  "openapi": "3.0.0"\n}';
      const result = convertFormat(jsonText);

      expect(result.success).toBe(true);
      expect(result.newLang).toBe('yaml');
      expect(result.result).toContain('openapi: 3.0.0');
    });

    it('must successfully convert valid YAML into a JSON string', () => {
      const yamlText = 'openapi: 3.0.0\ninfo:\n  title: Test';
      const result = convertFormat(yamlText);

      expect(result.success).toBe(true);
      expect(result.newLang).toBe('json');

      const parsedObj = JSON.parse(result.result);
      expect(parsedObj.openapi).toBe('3.0.0');
    });

    it('It should return `success: false` and the original text if the conversion fails within the `catch` block.', () => {
      const brokenJson = '{ openapi: 3.0.0 ';
      const result = convertFormat(brokenJson);

      expect(result.success).toBe(false);
      expect(result.result).toBe(brokenJson);
      expect(result.newLang).toBe('json');
    });
  });
});
