import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Layout');

  return (
    <footer className="border-t bg-slate-950 px-6 py-4 text-sm text-white">
      <div className="flex items-center justify-between">
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="
            transition-colors
            hover:text-blue-400
          "
        >
          {t('footerText')}
        </a>

        <div className="flex gap-10">
          <a
            href="https://github.com/AlexLalalala"
            target="_blank"
            rel="noopener noreferrer"
            className="
              transition-colors
              hover:text-blue-400
            "
          >
            Alexander (T L)
          </a>
          <a
            href="https://github.com/orgris"
            target="_blank"
            rel="noopener noreferrer"
            className="
              transition-colors
              hover:text-blue-400
            "
          >
            Maxim
          </a>
          <a
            href="https://github.com/Morevna"
            target="_blank"
            rel="noopener noreferrer"
            className="
              transition-colors
              hover:text-blue-400
            "
          >
            Maria
          </a>
        </div>

        <Link
          href="/about"
          className="
            transition-colors
            hover:text-blue-400
          "
        >
          {t('about')}
        </Link>
      </div>
    </footer>
  );
}
