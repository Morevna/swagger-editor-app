import { render, screen } from '@testing-library/react';
import Header from './Header';
import { createClient } from '@/lib/supabase/server';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/actions/auth', () => ({
  signOutAction: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : href.pathname} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/language-switcher/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher" />,
}));

vi.mock('./StickyHeaderShell', () => ({
  StickyHeaderShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function mockAuth(claims: object | null) {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getClaims: vi.fn().mockResolvedValue({ data: { claims } }),
    },
  } as any);
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows sign-in/sign-up when signed out', async () => {
    mockAuth(null);
    render(await Header());

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
    expect(screen.queryByText('signOut')).not.toBeInTheDocument();
    expect(screen.queryByText('history')).not.toBeInTheDocument();
  });

  it('shows history/sign-out when signed in', async () => {
    mockAuth({ sub: 'user-1' });
    render(await Header());

    expect(screen.getByText('history')).toBeInTheDocument();
    expect(screen.getByText('signOut')).toBeInTheDocument();
    expect(screen.queryByText('signIn')).not.toBeInTheDocument();
  });

  it('renders the language switcher and about link regardless of auth state', async () => {
    mockAuth(null);
    render(await Header());

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
  });
});
