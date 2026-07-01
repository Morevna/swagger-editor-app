export type SchemaFormat = 'json' | 'yaml';

export interface SwaggerEditorProps {
  onSchemaChange: (parsedData: unknown, format: SchemaFormat) => void;
}

export const DEFAULT_SCHEMA = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /hello:
    get:
      summary: Returns a greeting
      responses:
        '200':
          description: A successful response`;
