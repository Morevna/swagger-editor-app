import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RequestBodyEditor } from './RequestBodyEditor';
import { RequestBody } from './types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      required: 'Required',
    };
    return messages[key] || key;
  },
}));

describe('RequestBodyEditor Component', () => {
  const mockRequestBody: RequestBody = {
    description: 'New user data',
    required: true,
    content: {
      'application/json': {
        schema: { type: 'object' },
        example: { name: 'John Doe', age: 30 },
      },
    },
  };

  it('should correctly display content type, description and required tag', () => {
    render(<RequestBodyEditor requestBody={mockRequestBody} value="" onChange={vi.fn()} />);

    expect(screen.getByText('application/json')).toBeInTheDocument();

    expect(screen.getByText('New user data')).toBeInTheDocument();

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should render default content type if content object is missing', () => {
    const minimalRequestBody: RequestBody = {};

    render(<RequestBodyEditor requestBody={minimalRequestBody} value="" onChange={vi.fn()} />);

    expect(screen.getByText('application/json')).toBeInTheDocument();

    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('should format and output example as a textarea placeholder', () => {
    render(<RequestBodyEditor requestBody={mockRequestBody} value="" onChange={vi.fn()} />);

    const textarea = screen.getByRole('textbox');

    const expectedPlaceholder = JSON.stringify({ name: 'John Doe', age: 30 }, null, 2);
    expect(textarea).toHaveAttribute('placeholder', expectedPlaceholder);
  });

  it('should use default placeholder if example is missing', () => {
    const noExampleBody: RequestBody = {
      content: {
        'application/json': {
          schema: { type: 'object' },
        },
      },
    };

    render(<RequestBodyEditor requestBody={noExampleBody} value="" onChange={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', '{\n  "property": "value"\n}');
  });

  it('should call onChange on textarea input change', () => {
    const handleChange = vi.fn();

    render(<RequestBodyEditor requestBody={mockRequestBody} value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');

    const mockValue = '{"name": "Alice"}';
    fireEvent.change(textarea, { target: { value: mockValue } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(mockValue);
  });
});
