import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SwaggerEditor from './SwaggerEditor';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@monaco-editor/react', () => {
  return {
    default: ({ value, onChange }: { value: string; onChange: (val?: string) => void }) => (
      <textarea
        data-testid="mock-monaco-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  };
});

describe('SwaggerEditor Component', () => {
  const mockOnSchemaChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the title and format toggle buttons', () => {
    render(<SwaggerEditor onSchemaChange={mockOnSchemaChange} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'JSON' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'YAML' })).toBeInTheDocument();
  });

  it('must call onSchemaChange when valid JSON is entered', () => {
    render(<SwaggerEditor onSchemaChange={mockOnSchemaChange} />);

    const editor = screen.getByTestId('mock-monaco-editor');

    fireEvent.change(editor, { target: { value: '{"openapi": "3.0.0"}' } });

    expect(mockOnSchemaChange).toHaveBeenCalledWith({ openapi: '3.0.0' }, 'json');
    expect(screen.getByText('✓ noErrors')).toBeInTheDocument();
  });

  it('must display an error when invalid syntax is entered', () => {
    render(<SwaggerEditor onSchemaChange={mockOnSchemaChange} />);

    const editor = screen.getByTestId('mock-monaco-editor');

    fireEvent.change(editor, { target: { value: '{"openapi":' } });

    expect(screen.getByText(/✕ errors.PARSE_ERROR/)).toBeInTheDocument();
  });

  it('must switch the format to YAML upon clicking the button and convert the text', () => {
    render(<SwaggerEditor onSchemaChange={mockOnSchemaChange} />);

    const yamlButton = screen.getByRole('button', { name: 'YAML' });
    fireEvent.click(yamlButton);

    const editor = screen.getByTestId('mock-monaco-editor') as HTMLTextAreaElement;

    expect(editor.value).toContain('openapi: 3.0.0');
    expect(mockOnSchemaChange).toHaveBeenCalledWith(expect.any(Object), 'yaml');
  });
});
