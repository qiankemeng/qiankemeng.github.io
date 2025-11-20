import researchZh from '@/content/research/overview.zh.json';
import researchEn from '@/content/research/overview.en.json';
import worksZh from '@/content/research/works.zh.json';
import worksEn from '@/content/research/works.en.json';
import { ResearchWork, ResearchWorkLink } from '@/types/research';
import Link from 'next/link';

interface FocusItem {
  title: string;
  description: string;
}

interface ResearchOverview {
  headline: string;
  summary: string;
  focus: FocusItem[];
}

function ResearchLinkButton({ link }: { link: ResearchWorkLink }) {
  const baseClasses = "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all";

  // PDF下载按钮样式
  if (link.type === 'file') {
    return (
      <a
        href={link.url}
        download
        className={`${baseClasses} border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 hover:shadow-md dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:border-red-800/50 dark:hover:bg-red-900/40`}
        target="_blank"
        rel="noreferrer"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {link.label}
      </a>
    );
  }

  // GitHub链接样式
  if (link.label === 'GitHub') {
    return (
      <Link
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className={`${baseClasses} border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700/50`}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        {link.label}
      </Link>
    );
  }

  // 查看详情/View Details按钮样式
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${baseClasses} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:border-blue-800/50 dark:hover:bg-blue-900/40`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {link.label}
    </Link>
  );
}

export function ResearchSection({ locale }: { locale: 'zh' | 'en' }) {
  const overview = (locale === 'zh' ? researchZh : researchEn) as ResearchOverview;
  const works = (locale === 'zh' ? worksZh : worksEn) as ResearchWork[];

  return (
    <section id="research" className="py-16">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
          {locale === 'zh' ? 'Research Focus' : 'Research Focus'}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {overview.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {overview.summary}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {overview.focus.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {locale === 'zh' ? '科研成果' : 'Research Output'}
            </h3>
          </div>
          <Link
            href={locale === 'zh' ? '/research' : '/en/research'}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {locale === 'zh' ? '进入科研页 →' : 'View research →'}
          </Link>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {works.map((work) => (
            <li
              key={`${work.title}-${work.year}`}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{work.category}</span>
                <span>{work.year}</span>
              </div>
              <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {work.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{work.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {work.links.map((link) => (
                  <ResearchLinkButton key={link.url} link={link} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
