import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResponseViewer } from './ResponseViewer';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      response: 'Response',
      statusCode: 'Status Code',
      responseBody: 'Response Body',
      emptyBody: 'Empty Body',
      responseHeaders: 'Headers',
    };
    return messages[key] || key;
  },
}));

describe('ResponseViewer Component', () => {
  const defaultProps = {
    status: 200,
    headers: 'Content-Type: application/json',
    body: '{"success": true}',
  };

  it('should correctly display successful status (2xx) with green styling', () => {
    render(<ResponseViewer {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Response', level: 3 })).toBeInTheDocument();

    const statusBadge = screen.getByText('200');
    expect(statusBadge).toBeInTheDocument();

    expect(statusBadge).toHaveClass('text-emerald-700');
    expect(statusBadge).not.toHaveClass('text-red-700');
  });

  it('should display error status (non 2xx) with red styling', () => {
    render(<ResponseViewer {...defaultProps} status={404} />);

    const statusBadge = screen.getByText('404');
    expect(statusBadge).toBeInTheDocument();

    expect(statusBadge).toHaveClass('text-red-700');
    expect(statusBadge).not.toHaveClass('text-emerald-700');
  });

  it('should render the provided response body', () => {
    render(<ResponseViewer {...defaultProps} />);

    const bodyContainer = screen.getByText('{"success": true}');
    expect(bodyContainer).toBeInTheDocument();
    expect(bodyContainer.tagName).toBe('PRE');
  });

  it('should render "emptyBody" text if response body is missing or empty', () => {
    render(<ResponseViewer {...defaultProps} body="" />);

    expect(screen.getByText('Empty Body')).toBeInTheDocument();
    expect(screen.queryByText('{"success": true}')).not.toBeInTheDocument();
  });

  it('should render headers if they are provided', () => {
    render(<ResponseViewer {...defaultProps} />);

    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Content-Type: application/json')).toBeInTheDocument();
  });

  it('should not render headers section if headers prop is empty', () => {
    render(<ResponseViewer {...defaultProps} headers="" />);

    expect(screen.queryByText('Headers')).not.toBeInTheDocument();
    expect(screen.queryByText('Content-Type: application/json')).not.toBeInTheDocument();
  });
});
