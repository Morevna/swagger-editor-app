import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Layout');

  return (
    <footer className="border-t bg-slate-950 px-6 py-4 text-sm text-white">
      <div className="grid w-full grid-cols-3">
        <div>
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
        </div>
        <div className="flex justify-center gap-10">
          <a
            href="https://github.com/AlexLalalala"
            target="_blank"
            rel="noopener noreferrer"
            className="
              transition-colors
              hover:text-blue-400
            "
          >
            Alexander (TL)
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

        <div className="flex justify-end">
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
      </div>
    </footer>
  );
}
