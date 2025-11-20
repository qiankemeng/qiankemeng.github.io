import worksZh from '@/content/research/works.zh.json';
import worksEn from '@/content/research/works.en.json';
import { getPublicFileSize } from '@/lib/file-meta';
import { ResearchWork, ResearchWorkLink } from '@/types/research';
import Link from 'next/link';

function ResearchLink({ link }: { link: ResearchWorkLink }) {
  if (link.type === 'file') {
    const fileSize = getPublicFileSize(link.url);
    return (
      <a
        href={link.url}
        download
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
      >
        {link.label}
        {fileSize ? <span className="text-xs font-normal text-slate-500">{fileSize}</span> : null}
      </a>
    );
  }

  return (
    <Link href={link.url} target="_blank" rel="noreferrer">
      {link.label}
    </Link>
  );
}

export function ResearchListing({ locale }: { locale: 'zh' | 'en' }) {
  const works = (locale === 'zh' ? worksZh : worksEn) as ResearchWork[];

  return (
    <section className="py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Research</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {locale === 'zh' ? '科研项目与论文' : 'Research Projects & Papers'}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {locale === 'zh'
            ? '沉淀在多模态方向上的论文、课题与实验记录，将实践经验转化为可复用的方法论。'
            : 'A living log of multimodal papers, experiments, and studies that translate hands-on research into reusable methodologies.'}
        </p>
      </header>
      <ul className="space-y-6">
        {works.map((work) => (
          <li
            key={`${work.title}-${work.year}`}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{work.category}</span>
                  <span className="text-slate-400">•</span>
                  <span>{work.year}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {work.title}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{work.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm font-semibold text-[var(--accent)]">
                {work.links.map((link) => (
                  <ResearchLink key={link.url} link={link} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
