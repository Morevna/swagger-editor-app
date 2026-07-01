import { describe, it, expect } from 'vitest';
import { detectFormat, parseSchema, validateSchema, convertFormat } from './/editor-utils';

describe('Editor Utilities', () => {
  describe('detectFormat', () => {
    it('must identify JSON by the opening curly brace', () => {
      expect(detectFormat('  {"openapi": "3.0.0"}')).toBe('json');
      expect(detectFormat('[1, 2, 3]')).toBe('json');
    });

    it('must identify YAML in other cases', () => {
      expect(detectFormat('openapi: 3.0.0')).toBe('yaml');
      expect(detectFormat('info:\n  title: Test')).toBe('yaml');
    });
  });

  describe('parseSchema', () => {
    it('must successfully parse valid JSON', () => {
      const json = '{"key": "value"}';
      const result = parseSchema(json);
      expect(result.error).toBeNull();
      expect(result.data).toEqual({ key: 'value' });
    });

    it('must return PARSE_ERROR for invalid JSON', () => {
      const invalidJson = '{"key": "value"';
      const result = parseSchema(invalidJson);
      expect(result.error).toBe('PARSE_ERROR');
      expect(result.data).toBeNull();
    });

    it('must successfully parse valid YAML', () => {
      const yaml = 'key: value';
      const result = parseSchema(yaml);
      expect(result.error).toBeNull();
      expect(result.data).toEqual({ key: 'value' });
    });
  });

  describe('validateSchema', () => {
    it('must return null for a valid object', () => {
      expect(validateSchema({ openapi: '3.0.0' })).toBeNull();
    });

    it('must return an error if the data is not an object', () => {
      expect(validateSchema('string')).toBe('Invalid OpenAPI structure');
      expect(validateSchema(null)).toBe('Invalid OpenAPI structure');
    });
  });

  describe('convertFormat', () => {
    it('must convert JSON to YAML without errors', () => {
      const json = '{"name": "test"}';
      const conversion = convertFormat(json, 'json');
      expect(conversion.success).toBe(true);
      expect(conversion.newLang).toBe('yaml');
      expect(conversion.result).toContain('name: test');
    });

    it('must convert YAML to JSON without errors', () => {
      const yaml = 'name: test';
      const conversion = convertFormat(yaml, 'yaml');
      expect(conversion.success).toBe(true);
      expect(conversion.newLang).toBe('json');
      expect(JSON.parse(conversion.result)).toEqual({ name: 'test' });
    });

    it('must return success: false when converting broken syntax', () => {
      const brokenYaml = 'name: : test';
      const conversion = convertFormat(brokenYaml, 'yaml');
      expect(conversion.success).toBe(false);
      expect(conversion.result).toBe(brokenYaml);
    });
  });
});
