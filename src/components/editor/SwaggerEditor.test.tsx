import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SwaggerEditor from './SwaggerEditor';

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

describe('SwaggerEditor – full coverage suite', () => {
  const onSchemaChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    detectFormat.mockReturnValue('json');
    parseSchema.mockReturnValue({ data: {}, error: null });
    validateSchema.mockReturnValue(null);
  });

  it('renders the initial state without errors', () => {
    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByTestId('editor-valid')).toBeInTheDocument();
    expect(screen.getByText('noErrors')).toBeInTheDocument();
  });

  it('processes valid JSON input', () => {
    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

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

    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: '{ broken' },
    });

    expect(await screen.findByTestId('editor-error')).toBeInTheDocument();
    expect(screen.getByText('errors.PARSE_ERROR')).toBeInTheDocument();
    expect(onSchemaChange).toHaveBeenCalledWith(null, 'json');
  });

  it('shows a schema validation error', async () => {
    parseSchema.mockReturnValue({
      data: { openapi: '3.0.0' },
      error: null,
    });

    validateSchema.mockReturnValue('MISSING_INFO');

    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

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

    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'YAML' }));

    await waitFor(() => {
      expect(convertFormat).toHaveBeenCalled();
    });

    expect(screen.getByTestId('monaco-editor')).toHaveValue('openapi: 3.0.0');
  });

  it('handles empty input (clearing the editor)', () => {
    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    fireEvent.change(screen.getByTestId('monaco-editor'), {
      target: { value: '' },
    });

    expect(onSchemaChange).toHaveBeenCalledWith(null, 'json');
  });

  it('displays an error upon unsuccessful conversion', () => {
    convertFormat.mockReturnValue({
      success: false,
      result: '',
    });

    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'YAML' }));

    expect(screen.getByTestId('editor-error')).toBeInTheDocument();
    expect(screen.getByText('errors.INVALID_FORMAT')).toBeInTheDocument();
  });

  it('Does not switch the format if the same one is selected.', () => {
    render(<SwaggerEditor onSchemaChange={onSchemaChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));

    expect(convertFormat).not.toHaveBeenCalled();
  });
});
