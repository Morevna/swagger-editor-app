import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('LanguageSwitcher', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders an option for every configured locale', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'RU' })).toBeInTheDocument();
  });

  it('pre-selects the current locale', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('combobox')).toHaveValue('en');
  });

  it('calls router.replace with the new locale and preserves search params', async () => {
    const { useSearchParams } = await import('next/navigation');
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('queryKey=queryValue') as ReturnType<typeof useSearchParams>
    );

    await userEvent.selectOptions(render(<LanguageSwitcher />).getByRole('combobox'), 'ru');

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/about', query: { queryKey: 'queryValue' } },
      { locale: 'ru' }
    );
  });
});
