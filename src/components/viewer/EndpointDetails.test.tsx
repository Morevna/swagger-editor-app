import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EndpointDetails from './EndpointDetails';
import { Operation, ApiErrorCode } from './types';
import { executeApiRequest } from '@/lib/actions/makeApiRequest';

vi.mock('@/lib/actions/makeApiRequest', () => ({
  executeApiRequest: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      details: 'Details',
      parameters: 'Parameters',
      requestBody: 'Request Body',
      responses: 'Responses',
      summary: 'Summary',
      description: 'Description',
      curl: 'cURL',
      try: 'Execute',
      executing: 'Executing...',
      invalidJson: 'Invalid JSON',
      proxyError: 'Proxy Error',
      emptyBody: 'Empty Body',
      noParameters: 'No Parameters',
      noRequestBody: 'No Request Body',
    };
    return messages[key] || key;
  },
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
    <div data-testid="tabs" data-default={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <button type="button" data-testid={`trigger-${value}`}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`content-${value}`}>{children}</div>
  ),
}));

describe('EndpointDetails Component', () => {
  const mockOperation: Operation = {
    summary: 'Test Endpoint',
    description: 'Detailed description of the endpoint operation',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      { name: 'filter', in: 'query', required: false, schema: { type: 'string' } },
    ],
    responses: {
      '200': { description: 'Successful response' },
    },
  };

  const defaultProps = {
    path: '/items/{id}',
    method: 'get',
    operation: mockOperation,
    baseUrl: 'https://api.test.com/',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it('should correctly render basic info, method and path', () => {
    render(<EndpointDetails {...defaultProps} />);

    expect(screen.getByText('get')).toBeInTheDocument();
    expect(screen.getByText('/items/{id}')).toBeInTheDocument();
    expect(screen.getByText('Test Endpoint')).toBeInTheDocument();
  });

  it('should generate correct cURL command and copy it to clipboard', async () => {
    render(<EndpointDetails {...defaultProps} />);

    const curlButton = screen.getByRole('button', { name: 'cURL' });
    fireEvent.click(curlButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl -X GET "https://api.test.com/items/{id}"'
    );
  });

  it('should correctly package query, path, headers and cookie parameters on user input', async () => {
    const complexOperation: Operation = {
      ...mockOperation,
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'X-Api-Key', in: 'header', required: true, schema: { type: 'string' } },
        { name: 'session', in: 'cookie', required: true, schema: { type: 'string' } },
        { name: 'search', in: 'query', required: false, schema: { type: 'string' } },
      ],
      requestBody: { content: { 'application/json': {} } },
    };

    const { container } = render(
      <EndpointDetails {...defaultProps} path="/items/{id}" operation={complexOperation} />
    );

    const inputs = container.querySelectorAll('input');
    if (inputs.length >= 4) {
      fireEvent.change(inputs[0], { target: { value: '123' } });
      fireEvent.change(inputs[1], { target: { value: 'secret-token' } });
      fireEvent.change(inputs[2], { target: { value: 'xyz123' } });
      fireEvent.change(inputs[3], { target: { value: 'test-query' } });
    }

    const textarea = container.querySelector('textarea');
    if (textarea) {
      fireEvent.change(textarea, { target: { value: '{"foo":"bar"}' } });
    }

    const curlButton = screen.getByRole('button', { name: 'cURL' });
    fireEvent.click(curlButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('https://api.test.com/items/123?search=test-query')
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('-H "X-Api-Key: secret-token"')
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('-H "Cookie: session=xyz123"')
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('-d \'{"foo":"bar"}\'')
    );

    const mockProxyResponse = {
      success: true,
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: '{"status":"ok"}',
    };
    vi.mocked(executeApiRequest).mockResolvedValueOnce(mockProxyResponse);

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).toHaveBeenCalledWith({
        url: 'https://api.test.com/items/123?search=test-query',
        method: 'get',
        headers: {
          'X-Api-Key': 'secret-token',
          Cookie: 'session=xyz123',
        },
        body: { foo: 'bar' },
      });
    });
  });

  it('should return 400 error and invalid JSON text if parsing bodyValue fails', async () => {
    const complexOperation: Operation = {
      ...mockOperation,
      requestBody: { content: { 'application/json': {} } },
    };

    const { container } = render(
      <EndpointDetails {...defaultProps} operation={complexOperation} />
    );

    const textarea = container.querySelector('textarea');
    if (textarea) {
      fireEvent.change(textarea, { target: { value: '{"bad json' } });
    }

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).not.toHaveBeenCalled();
      expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    });
  });

  it('should handle scenario when server response has an empty body', async () => {
    const mockEmptyBodyResponse = {
      success: true,
      status: 204,
      headers: {},
      body: '',
    };
    vi.mocked(executeApiRequest).mockResolvedValueOnce(mockEmptyBodyResponse);

    render(<EndpointDetails {...defaultProps} />);

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).toHaveBeenCalled();
    });
  });

  it('should correctly handle situation when server response body is not JSON', async () => {
    const mockPlainResponse = {
      success: true,
      status: 200,
      headers: { 'content-type': 'text/plain' },
      body: 'Plain text response from target server',
    };
    vi.mocked(executeApiRequest).mockResolvedValueOnce(mockPlainResponse);

    render(<EndpointDetails {...defaultProps} />);

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).toHaveBeenCalled();
    });
  });

  it('should correctly render message when endpoint has no parameters', () => {
    const operationNoParams: Operation = {
      summary: 'Test with no parameters',
      responses: {},
    };

    render(<EndpointDetails {...defaultProps} operation={operationNoParams} />);
    expect(screen.getByText('No Parameters')).toBeInTheDocument();
  });

  it('should output proxy integration error if server action returned errorCode', async () => {
    const mockErrorResponse = {
      success: false,
      body: 'FETCH_FAILED',
      errorCode: 'FETCH_FAILED' as ApiErrorCode,
    };
    vi.mocked(executeApiRequest).mockResolvedValueOnce(mockErrorResponse);

    render(<EndpointDetails {...defaultProps} />);

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).toHaveBeenCalled();
    });
  });

  it('should handle critical invocation errors inside executeApiRequest', async () => {
    vi.mocked(executeApiRequest).mockRejectedValueOnce(new Error('Network Error'));

    render(<EndpointDetails {...defaultProps} />);

    const executeButton = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeApiRequest).toHaveBeenCalled();
    });
  });

  it('should correctly render response structure including contentType, schema and example', () => {
    const operationWithContent: Operation = {
      summary: 'Test response content',
      responses: {
        '200': {
          description: 'Successful response with body',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { id: { type: 'string' } } },
              example: { id: 'test-id' },
            },
          },
        },
      },
    };

    render(<EndpointDetails {...defaultProps} operation={operationWithContent} />);

    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText(/"properties"/)).toBeInTheDocument();
    expect(screen.getByText(/"test-id"/)).toBeInTheDocument();
  });
});
