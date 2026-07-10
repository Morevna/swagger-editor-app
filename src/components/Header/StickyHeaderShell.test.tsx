import { render, screen } from '@testing-library/react';
import { StickyHeaderShell } from './StickyHeaderShell';
import { useStickyHeader } from '@/lib/hooks/useStickyHeader';

vi.mock('@/lib/hooks/useStickyHeader');

describe('StickyHeaderShell', () => {
  it('renders relaxed styles when not sticky', () => {
    vi.mocked(useStickyHeader).mockReturnValue({
      sentinelRef: { current: null },
      isSticky: false,
    });

    render(
      <StickyHeaderShell>
        <span>content</span>
      </StickyHeaderShell>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('py-1');
    expect(header).not.toHaveClass('shadow-md');
  });

  it('renders compact/elevated styles when sticky', () => {
    vi.mocked(useStickyHeader).mockReturnValue({
      sentinelRef: { current: null },
      isSticky: true,
    });

    render(
      <StickyHeaderShell>
        <span>content</span>
      </StickyHeaderShell>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('shadow-md');
    expect(header).not.toHaveClass('py-1');
  });

  it('always renders children', () => {
    vi.mocked(useStickyHeader).mockReturnValue({
      sentinelRef: { current: null },
      isSticky: false,
    });

    render(
      <StickyHeaderShell>
        <span>content</span>
      </StickyHeaderShell>
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
