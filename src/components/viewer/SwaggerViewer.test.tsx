import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwaggerViewer from './SwaggerViewer';
import { OpenApiSchema } from './types';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      loadSchema: 'Load Schema',
      search: 'Search...',
    };
    return messages[key] || key;
  },
}));

vi.mock('./EndpointList', () => ({
  default: ({
    paths,
    onSelect,
  }: {
    paths: Record<string, Record<string, unknown>>;
    onSelect: (path: string, method: string) => void;
  }) => (
    <div data-testid="mock-endpoint-list">
      {Object.keys(paths).map((path) => (
        <div key={path} data-testid={`path-group-${path}`}>
          {Object.keys(paths[path] || {}).map((method) => (
            <button key={method} type="button" onClick={() => onSelect(path, method)}>
              {`${method}-${path}`}
            </button>
          ))}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./EndpointDetails', () => ({
  default: ({
    path,
    method,
  }: {
    path: string;
    method: string;
    baseUrl: string;
    operation: unknown;
  }) => (
    <div data-testid="mock-endpoint-details">
      <h2>{`Details: ${method.toUpperCase()} ${path}`}</h2>
    </div>
  ),
}));

describe('SwaggerViewer Component', () => {
  const mockSchema: OpenApiSchema = {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    servers: [{ url: 'https://api.example.com' }],
    paths: {
      '/users': {
        get: { summary: 'List users' },
        post: { summary: 'Create user' },
      },
      '/posts': {
        get: { summary: 'List posts' },
      },
    },
  };

  it('should render fallback message if schema is not provided', () => {
    render(<SwaggerViewer schema={null} />);

    expect(screen.getByText('Load Schema')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('should initialize with the first found endpoint', () => {
    render(<SwaggerViewer schema={mockSchema} />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();

    expect(screen.getByTestId('mock-endpoint-details')).toHaveTextContent('Details: GET /users');
  });

  it('should change displayed endpoint when selected from the list', () => {
    render(<SwaggerViewer schema={mockSchema} />);

    const postEndpointButton = screen.getByRole('button', { name: 'get-/posts' });
    fireEvent.click(postEndpointButton);

    expect(screen.getByTestId('mock-endpoint-details')).toHaveTextContent('Details: GET /posts');
  });

  it('should filter the endpoint list based on search query input', () => {
    render(<SwaggerViewer schema={mockSchema} />);

    const searchInput = screen.getByPlaceholderText('Search...');

    expect(screen.getByTestId('path-group-/users')).toBeInTheDocument();
    expect(screen.getByTestId('path-group-/posts')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'posts' } });

    expect(screen.queryByTestId('path-group-/users')).not.toBeInTheDocument();
    expect(screen.getByTestId('path-group-/posts')).toBeInTheDocument();
  });
});
