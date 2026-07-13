import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AboutView from './AboutView';

type MockImageProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'width' | 'height' | 'className'
>;

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

      if (translations[key]) return translations[key];

      if (key.includes('.')) {
        return key.split('.').pop() || key;
      }

      return key;
    })
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

vi.mock('@/constants/about', () => ({
  team: [
    {
      name: 'Alexander',
      role: 'frontend',
      github: 'https://github.com/AlexLalalala',
      avatar: '/alex.png',
    },
    { name: 'Maxim', role: 'frontend', github: 'https://github.com/orgris', avatar: '/maxim.png' },
    { name: 'Maria', role: 'frontend', github: 'https://github.com/Morevna', avatar: '/maria.png' },
  ],
  technologies: [
    { name: 'React', icon: () => null, className: '' },
    { name: 'Next.js', icon: () => null, className: '' },
  ],
  links: [
    {
      name: 'RS School',
      description: 'School website',
      href: 'https://rs.school/',
      icon: () => null,
      className: '',
    },
    {
      name: 'React Course',
      description: 'Course page',
      href: 'https://rs.school/courses/reactjs',
      icon: () => null,
      className: '',
    },
    {
      name: 'Repository',
      description: 'Project source code',
      href: 'https://github.com/AlexLalalala/swagger-editor-app',
      icon: () => null,
      className: '',
    },
  ],
}));

describe('AboutView', () => {
  async function renderPage() {
    const ResultJSX = await AboutView();
    render(ResultJSX);
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
