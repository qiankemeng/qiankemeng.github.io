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
  const baseClasses = "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all";

  // PDF下载按钮样式
  if (link.type === 'file') {
    return (
      <a
        href={link.url}
        download
        className={`${baseClasses} border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
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
        className={`${baseClasses} border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
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
      className={`${baseClasses} border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]`}
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
    <section id="research" className="section-shell">
      <div className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-kicker">
          {locale === 'zh' ? 'Research Focus' : 'Research Focus'}
        </p>
        <h2 className="section-title">
          {overview.headline}
        </h2>
        <p className="section-lede">
          {overview.summary}
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {overview.focus.map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {locale === 'zh' ? '科研成果' : 'Research Output'}
            </h3>
          </div>
          <Link
            href={locale === 'zh' ? '/research' : '/en/research'}
            className="pill-link text-[var(--accent)] hover:border-[var(--accent)]"
          >
            {locale === 'zh' ? '进入科研页 →' : 'View research →'}
          </Link>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {works
            .filter((work) => !work.title.includes('本科毕业论文') && !work.title.includes('Undergraduate Thesis'))
            .map((work) => (
            <li
              key={`${work.title}-${work.year}`}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                <span>{work.category}</span>
                <span>{work.year}</span>
              </div>
              <h4 className="mt-3 text-lg font-semibold leading-7 tracking-[-0.02em] text-[var(--foreground)]">
                {work.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{work.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="meta-chip"
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
