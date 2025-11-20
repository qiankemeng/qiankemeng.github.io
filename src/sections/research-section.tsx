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
  if (link.type === 'file') {
    return (
      <a href={link.url} download className="hover:underline" target="_blank" rel="noreferrer">
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
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
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {locale === 'zh'
                ? '持续整理论文、专利与实验记录，沉淀多模态研究路径。'
                : 'Curated papers, patents, and experiment logs that track multimodal research progress.'}
            </p>
          </div>
          <Link
            href={locale === 'zh' ? '/research' : '/en/research'}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {locale === 'zh' ? '进入科研页 →' : 'View research →'}
          </Link>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {works.slice(0, 2).map((work) => (
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
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--accent)]">
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
