import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SwaggerEditor, { SwaggerEditorProps } from './SwaggerEditor';
import useSaveSpec from '@/lib/hooks/useSaveSpec';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@monaco-editor/react', () => {
  type EditorProps = {
    value: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
  };

  return {
    default: function MockEditor(props: EditorProps) {
      return (
        <textarea
          data-testid="monaco-editor"
          value={props.value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => props.onChange?.(e.target.value)}
        />
      );
    },
  };
});

vi.mock('@/lib/hooks/useSaveSpec');
const mockedUseSaveSpec = vi.mocked(useSaveSpec);

const defaultSaveState = {
  save: vi.fn(),
  isPending: false,
  saveError: null,
  isDirty: vi.fn().mockReturnValue(true),
};

type ParseResult = { data: unknown; error: string | null };
type ValidateResult = string | null;
type Format = 'json' | 'yaml';

type ConvertResult = {
  success: boolean;
  result: string;
};

const parseSchema = vi.fn<(text: string) => ParseResult>();
const validateSchema = vi.fn<(data: unknown) => ValidateResult>();
const detectFormat = vi.fn<(text: string) => Format>();
const convertFormat = vi.fn<(text: string, format: Format) => ConvertResult>();

vi.mock('../../lib/editor-utils', () => ({
  parseSchema: (t: string) => parseSchema(t),
  validateSchema: (d: unknown) => validateSchema(d),
  detectFormat: (t: string) => detectFormat(t),
  convertFormat: (t: string, f: Format) => convertFormat(t, f),
}));

const onSchemaChange = vi.fn();

const renderSwaggerEditor = (overwrite?: Partial<SwaggerEditorProps>) => {
  const props = {
    onSchemaChange: onSchemaChange,
    initialSchema: 'test',
    isSignedIn: true,
    ...overwrite,
  };
  return render(<SwaggerEditor {...props} />);
};

describe('SwaggerEditor – full coverage suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSaveSpec.mockReturnValue(defaultSaveState);

    detectFormat.mockReturnValue('json');
    parseSchema.mockReturnValue({ data: {}, error: null });
    validateSchema.mockReturnValue(null);
  });

  it('renders the initial state without errors', () => {
    const testSpec = '{"openapi":"3.0.0"}';
    renderSwaggerEditor({ initialSchema: testSpec });

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByTestId('editor-valid')).toBeInTheDocument();
    expect(screen.getByText('noErrors')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-editor')).toHaveValue(testSpec);
  });

  it('processes valid JSON input', () => {
    renderSwaggerEditor();

    const editor = screen.getByTestId('monaco-editor');

    fireEvent.change(editor, {
      target: { value: '{"openapi":"3.0.0"}' },
    });

    expect(detectFormat).toHaveBeenCalledWith('{"openapi":"3.0.0"}');
    expect(onSchemaChange).toHaveBeenCalled();
  });

  it('shows a parsing error', async () => {
    parseSchema.mockReturnValue({
      data: null,
      error: 'PARSE_ERROR',
    });

    renderSwaggerEditor();

    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: '{ broken' },
    });

    expect(await screen.findByTestId('editor-error')).toBeInTheDocument();
    expect(screen.getByText('errors.PARSE_ERROR')).toBeInTheDocument();
    expect(onSchemaChange).toHaveBeenCalledWith(null);
  });

  it('shows a schema validation error', async () => {
    parseSchema.mockReturnValue({
      data: { openapi: '3.0.0' },
      error: null,
    });

    validateSchema.mockReturnValue('MISSING_INFO');

    renderSwaggerEditor();

    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: '{"openapi":"3.0.0"}' },
    });

    expect(await screen.findByTestId('editor-error')).toBeInTheDocument();
    expect(screen.getByText('errors.MISSING_INFO')).toBeInTheDocument();
  });

  it('switches JSON - YAML', async () => {
    convertFormat.mockReturnValue({
      success: true,
      result: 'openapi: 3.0.0',
    });

    renderSwaggerEditor();

    fireEvent.click(screen.getByRole('button', { name: 'YAML' }));

    await waitFor(() => {
      expect(convertFormat).toHaveBeenCalled();
    });

    expect(screen.getByTestId('monaco-editor')).toHaveValue('openapi: 3.0.0');
  });

  it('handles empty input (clearing the editor)', () => {
    renderSwaggerEditor();

    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: '' },
    });

    expect(onSchemaChange).toHaveBeenCalledWith(null);
  });

  it('displays an error upon unsuccessful conversion', () => {
    convertFormat.mockReturnValue({
      success: false,
      result: '',
    });

    renderSwaggerEditor();

    fireEvent.click(screen.getByRole('button', { name: 'YAML' }));

    expect(screen.getByTestId('editor-error')).toBeInTheDocument();
    expect(screen.getByText('errors.INVALID_FORMAT')).toBeInTheDocument();
  });

  it('Does not switch the format if the same one is selected.', () => {
    renderSwaggerEditor();

    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));

    expect(convertFormat).not.toHaveBeenCalled();
  });

  it('has enabled save button when authenticated', () => {
    renderSwaggerEditor({ isSignedIn: true });

    expect(screen.getByRole('button', { name: 'save' })).toBeEnabled();
  });

  it('has disabled save button when unauthenticated', () => {
    renderSwaggerEditor({ isSignedIn: false });

    expect(screen.getByRole('button', { name: 'save' })).toBeDisabled();
  });
});
