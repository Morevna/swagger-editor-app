import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AboutPage from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() =>
    Promise.resolve((key: string) => {
      const translations: Record<string, string> = {
        title: 'About This Project',
        description: 'This application was built as part of the RS School React course.',
        team: 'Our Team',
        technologies: 'Technologies',
        links: 'Links',
      };

      return translations[key];
    })
  ),
}));

describe('AboutPage', () => {
  async function renderPage() {
    render(await AboutPage());
  }

  it('renders information about the project and RS School course', async () => {
    await renderPage();

    expect(
      screen.getByRole('heading', {
        name: 'About This Project',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('This application was built as part of the RS School React course.')
    ).toBeInTheDocument();
  });

  it('renders GitHub links for all team members', async () => {
    await renderPage();

    expect(screen.getByRole('link', { name: /Alexander/i })).toHaveAttribute(
      'href',
      'https://github.com/AlexLalalala'
    );

    expect(screen.getByRole('link', { name: /Maxim/i })).toHaveAttribute(
      'href',
      'https://github.com/orgris'
    );

    expect(screen.getByRole('link', { name: /Maria/i })).toHaveAttribute(
      'href',
      'https://github.com/Morevna'
    );
  });

  it('renders relevant project resource links', async () => {
    await renderPage();

    const links = screen.getAllByRole('link');

    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('https://rs.school/');
    expect(hrefs).toContain('https://rs.school/courses/reactjs');
    expect(hrefs).toContain('https://github.com/AlexLalalala/swagger-editor-app');
  });
});
