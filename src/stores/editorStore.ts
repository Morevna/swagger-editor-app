import { create } from 'zustand';

export type SchemaFormat = 'json' | 'yaml';

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

interface EditorState {
  code: string;
  language: 'json' | 'yaml';
  errors: string[];
  setCode: (code: string) => void;
  setLanguage: (lang: 'json' | 'yaml') => void;
  setErrors: (errors: string[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_SCHEMA,
  language: 'yaml',
  errors: [],
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setErrors: (errors) => set({ errors }),
}));
