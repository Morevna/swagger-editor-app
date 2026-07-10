import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EndpointList from './EndpointList';
import { PathItem } from './types';

const mockPaths: Record<string, PathItem> = {
  '/users': {
    get: { summary: 'Get users list' },
    post: { summary: 'Create a user' },
  },
  '/users/{id}': {
    delete: { summary: 'Delete user' },
  },
};

describe('EndpointList Component', () => {
  it('should correctly render paths and available methods', () => {
    render(<EndpointList paths={mockPaths} selectedPath="" selectedMethod="" onSelect={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '/users', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '/users/{id}', level: 3 })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'get/users' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'post/users' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete/users/{id}' })).toBeInTheDocument();

    const putButton = screen.queryByRole('button', { name: 'put/users/{id}' });
    expect(putButton).not.toBeInTheDocument();
  });

  it('should call onSelect with correct parameters on click', () => {
    const handleSelect = vi.fn();
    render(
      <EndpointList paths={mockPaths} selectedPath="" selectedMethod="" onSelect={handleSelect} />
    );

    const postButton = screen.getByRole('button', { name: 'post/users' });
    fireEvent.click(postButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('/users', 'post');
  });

  it('should visually highlight the selected endpoint active state', () => {
    render(
      <EndpointList
        paths={mockPaths}
        selectedPath="/users"
        selectedMethod="post"
        onSelect={vi.fn()}
      />
    );

    const activeButton = screen.getByRole('button', { name: 'post/users' });
    const inactiveButton = screen.getByRole('button', { name: 'get/users' });

    expect(activeButton).toHaveClass('border-blue-500');
    expect(inactiveButton).not.toHaveClass('border-blue-500');
  });
});
