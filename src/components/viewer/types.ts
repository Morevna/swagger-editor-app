export const API_ERROR_CODES = {
  URL_REQUIRED: 'URL_REQUIRED',
  FETCH_FAILED: 'FETCH_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

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
  schema?: object;
  example?: object;
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

export type StatusType = {
  status: number;
  headers: string;
  body: string;
} | null;
