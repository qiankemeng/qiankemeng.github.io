import projectsZh from '@/content/projects/projects.zh.json';
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

export default function ProjectsListingZh() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold">项目一览</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        占位数据：后续可替换为真实项目内容。
      </p>
      <ul className="mt-10 space-y-6">
        {(projectsZh as Project[]).map((project) => (
          <li key={project.title} className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.summary}</p>
            <div className="mt-3 flex gap-4 text-sm text-[var(--accent)]">
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
          </li>
        ))}
      </ul>
    </section>
  );
}
