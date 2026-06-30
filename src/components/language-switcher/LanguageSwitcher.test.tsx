import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher';

vi.mock('next-intl', () => ({
  useLocale: vi.fn(() => 'en'),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: vi.fn(() => ({ replace: mockReplace })),
  usePathname: vi.fn(() => '/about'),
}));

vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'ru'] },
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  window.PointerEvent = class PointerEvent extends MouseEvent {} as unknown as typeof PointerEvent;
  Object.assign(window.HTMLElement.prototype, {
    scrollIntoView: vi.fn(),
    hasPointerCapture: vi.fn(() => false),
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
  });
});

describe('LanguageSwitcher', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders an option for every configured locale', async () => {
    render(<LanguageSwitcher />);

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'RU' })).toBeInTheDocument();
    });
  });

  it('pre-selects the current locale', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('combobox')).toHaveTextContent('EN');
  });

  it('calls router.replace with the new locale and preserves search params', async () => {
    const { useSearchParams } = await import('next/navigation');
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('queryKey=queryValue') as ReturnType<typeof useSearchParams>
    );

    render(<LanguageSwitcher />);

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(async () => {
      const ruOption = screen.getByRole('option', { name: 'RU' });
      expect(ruOption).toBeInTheDocument();
      await userEvent.click(ruOption);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/about', query: { queryKey: 'queryValue' } },
      { locale: 'ru' }
    );
  });
});
