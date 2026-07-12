import {
  Atom,
  Blocks,
  Braces,
  Database,
  FileCode2,
  FolderGit2,
  GraduationCap,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const team = [
  {
    name: 'Alexander',
    role: 'Team Lead & Developer',
    github: 'https://github.com/AlexLalalala',
    avatar: 'https://github.com/AlexLalalala.png',
  },
  {
    name: 'Maxim',
    role: 'Developer',
    github: 'https://github.com/orgris',
    avatar: 'https://github.com/orgris.png',
  },
  {
    name: 'Maria',
    role: 'Developer',
    github: 'https://github.com/Morevna',
    avatar: 'https://github.com/Morevna.png',
  },
];

const technologies = [
  {
    name: 'Next.js',
    icon: FileCode2,
    className: 'text-zinc-900',
  },
  {
    name: 'TypeScript',
    icon: Braces,
    className: 'text-blue-600',
  },
  {
    name: 'shadcn/ui',
    icon: Blocks,
    className: 'text-violet-600',
  },
  {
    name: 'Zod',
    icon: ShieldCheck,
    className: 'text-indigo-600',
  },
  {
    name: 'React Hook Form',
    icon: Atom,
    className: 'text-cyan-500',
  },
  {
    name: 'Tailwind CSS',
    icon: Palette,
    className: 'text-sky-500',
  },
  {
    name: 'Supabase',
    icon: Database,
    className: 'text-emerald-500',
  },
];

const links = [
  {
    name: 'RS School',
    description: 'Frontend development school',
    href: 'https://rs.school/',
    icon: GraduationCap,
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    name: 'React Course',
    description: 'RS School React course',
    href: 'https://rs.school/courses/reactjs',
    icon: Atom,
    className: 'bg-cyan-50 text-cyan-500 border-cyan-200',
  },
  {
    name: 'Swagger Editor Repository',
    description: 'Project source code',
    href: 'https://github.com/AlexLalalala/swagger-editor-app',
    icon: FolderGit2,
    className: 'bg-violet-50 text-violet-600 border-violet-200',
  },
];

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-8 py-10">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>

      <div
        className="
          mt-8 grid gap-16
          md:grid-cols-2
        "
      >
        <div>
          <p className="max-w-2xl text-sm/7 text-zinc-600">{t('description')}</p>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t('team')}</h2>

            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <a
                  key={member.name}
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow
                    hover:shadow-md
                  "
                >
                  <Image
                    src={member.avatar}
                    alt={`${member.name} GitHub avatar`}
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">{member.name}</h3>

                    <p className="text-sm text-zinc-500">{member.role}</p>

                    <span
                      className="
                        mt-1 inline-block text-sm text-blue-600
                        hover:underline
                      "
                    >
                      {member.github.replace('https://github.com/', '@')}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section>
            <h2 className="text-lg font-semibold">{t('technologies')}</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {technologies.map((technology) => {
                const Icon = technology.icon;

                return (
                  <div
                    key={technology.name}
                    className="
                      flex items-center gap-2 rounded-lg border bg-white px-4 py-3 transition
                      hover:-translate-y-0.5 hover:shadow-md
                    "
                  >
                    <Icon size={20} className={technology.className} />

                    <span className="text-sm font-medium">{technology.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-lg font-semibold">{t('links')}</h2>

            <div className="mt-6 space-y-3">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-4 rounded-xl border bg-white p-4 transition
                      hover:-translate-y-0.5 hover:shadow-md
                    "
                  >
                    <div
                      className={`
                        flex size-11 items-center justify-center rounded-lg border
                        ${link.className}
                      `}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{link.name}</h3>

                      <p className="text-xs text-zinc-500">{link.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
