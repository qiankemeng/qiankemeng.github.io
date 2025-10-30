import projectsZh from '@/content/projects/projects.zh.json';
import projectsEn from '@/content/projects/projects.en.json';
import Link from 'next/link';

interface Project {
  title: string;
  summary: string;
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {project.title}
        </h3>
        <div className="flex gap-2 text-sm text-[var(--accent)]">
          {project.links.github ? (
            <Link href={project.links.github} target="_blank" rel="noreferrer">
              GitHub
            </Link>
          ) : null}
          {project.links.demo ? (
            <Link href={project.links.demo} target="_blank" rel="noreferrer">
              Demo
            </Link>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {project.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </li>
  );
}

export function ProjectsSection({ locale }: { locale: 'zh' | 'en' }) {
  const collection = (locale === 'zh' ? projectsZh : projectsEn) as Project[];

  return (
    <section id="projects" className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {locale === 'zh' ? '精选项目' : 'Featured Projects'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {locale === 'zh'
              ? '近期代表性作品与探索，覆盖 Web 应用与设计系统。'
              : 'Selected work across web applications and design systems.'}
          </p>
        </div>
        <Link href={locale === 'zh' ? '/projects' : '/en/projects'} className="text-sm">
          {locale === 'zh' ? '查看全部' : 'View all'}
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {collection.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ul>
    </section>
  );
}
