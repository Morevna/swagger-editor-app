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

export const team = [
  {
    name: 'alexander',
    role: 'teamLeadDeveloper',
    github: 'https://github.com/AlexLalalala',
    avatar: 'https://github.com/AlexLalalala.png',
  },
  {
    name: 'maxim',
    role: 'developer',
    github: 'https://github.com/orgris',
    avatar: 'https://github.com/orgris.png',
  },
  {
    name: 'maria',
    role: 'developer',
    github: 'https://github.com/Morevna',
    avatar: 'https://github.com/Morevna.png',
  },
];

export const technologies = [
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

export const links = [
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
