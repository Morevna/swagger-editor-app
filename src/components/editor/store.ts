import { create } from 'zustand';
import { DEFAULT_SCHEMA } from './types';

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
