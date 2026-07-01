import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { useEditorStore } from '../../stores/editorStore';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('EditorToolbar Component', () => {
  beforeEach(() => {
    useEditorStore.setState({
      code: '{"openapi": "3.0.0"}',
      language: 'json',
      errors: [],
    });
  });

  it('must correctly display the current language', () => {
    render(<EditorToolbar />);
    expect(screen.getByText('json')).toBeInTheDocument();
  });

  it('must update the state when clicking the convert button for valid code', () => {
    render(<EditorToolbar />);

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    const updatedState = useEditorStore.getState();
    expect(updatedState.language).toBe('yaml');
    expect(updatedState.errors).toEqual([]);
  });

  it('should output an error if the code in the editor is broken', () => {
    useEditorStore.setState({
      code: '{"broken": json',
      language: 'json',
      errors: [],
    });

    render(<EditorToolbar />);

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    const updatedState = useEditorStore.getState();
    expect(updatedState.errors.length).toBeGreaterThan(0);
    expect(screen.getByText(/❌/)).toBeInTheDocument();
  });
});
