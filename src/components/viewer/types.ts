export interface OpenApiSchema {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
  servers?: { url: string }[];
  paths: Record<string, PathItem>;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  description?: string;
  schema?: {
    type: string;
    default?: unknown;
  };
}

export interface ResponseContent {
  schema?: unknown;
  example?: unknown;
}

export interface ResponseItem {
  description: string;
  content?: Record<string, ResponseContent>;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content?: Record<string, ResponseContent>;
}

export interface Operation {
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, ResponseItem>;
}
