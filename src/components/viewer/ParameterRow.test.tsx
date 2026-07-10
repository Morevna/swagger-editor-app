import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ParameterRow } from './ParameterRow';
import { Parameter } from './types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      type: 'Type',
      value: 'Value',
    };
    return messages[key] || key;
  },
}));

describe('ParameterRow Component', () => {
  const defaultParam: Parameter = {
    name: 'userId',
    in: 'query',
    required: false,
    description: 'User identifier',
    schema: {
      type: 'integer',
    },
  };

  it('should correctly render basic parameter information', () => {
    render(<ParameterRow parameter={defaultParam} value="" onChange={vi.fn()} />);

    expect(screen.getByText('userId')).toBeInTheDocument();
    expect(screen.getByText('query')).toBeInTheDocument();
    expect(screen.getByText('User identifier')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Type: integer');
  });

  it('should show red asterisk for required parameter', () => {
    const requiredParam: Parameter = { ...defaultParam, required: true };

    render(<ParameterRow parameter={requiredParam} value="" onChange={vi.fn()} />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500');
  });

  it('should not render description if it is missing in parameter object', () => {
    const paramWithoutDescription = { ...defaultParam, description: undefined };

    render(<ParameterRow parameter={paramWithoutDescription} value="" onChange={vi.fn()} />);

    expect(screen.queryByText('User identifier')).not.toBeInTheDocument();
  });

  it('should correctly call onChange on text input change', () => {
    const handleChange = vi.fn();

    render(<ParameterRow parameter={defaultParam} value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '123' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('123');
  });
});
