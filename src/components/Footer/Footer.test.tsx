import { render, screen } from '@testing-library/react';
import Footer from './Footer';

vi.mock('next/link', () => ({
  default: ({ href, children, props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

describe('Footer', () => {
  it('renders without crashing', async () => {
    render(await Footer());
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the translated links', async () => {
    render(await Footer());
    expect(screen.getByText('footerText')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
  });

  it('renders all team member links', async () => {
    render(await Footer());
    expect(screen.getByText('Alexander (TL)')).toBeInTheDocument();
    expect(screen.getByText('Maxim')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});
