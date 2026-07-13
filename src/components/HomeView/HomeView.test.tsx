import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeView from './HomeView';

vi.mock('@/components/editor/SwaggerEditor', () => ({
  default: () => <div data-testid="mock-swagger-editor" />,
}));

vi.mock('@/components/viewer/SwaggerViewer', () => ({
  default: () => <div data-testid="mock-swagger-viewer" />,
}));

describe('HomeView', () => {
  it('renders without crashing', () => {
    render(<HomeView initialSpec="{}" isSignedIn={false} />);

    expect(screen.getByTestId('mock-swagger-editor')).toBeInTheDocument();
    expect(screen.getByTestId('mock-swagger-viewer')).toBeInTheDocument();
  });
});
