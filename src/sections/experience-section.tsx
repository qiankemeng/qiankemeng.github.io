import experienceZh from '@/content/experience/experience.zh.json';
import experienceEn from '@/content/experience/experience.en.json';
import Image from 'next/image';
import Link from 'next/link';

interface ExperienceItem {
  timeframe: string;
  title: string;
  company: string;
  logo: string;
  url: string;
  highlights: string[];
}

export function ExperienceSection({ locale }: { locale: 'zh' | 'en' }) {
  const list = (locale === 'zh' ? experienceZh : experienceEn) as ExperienceItem[];

  return (
    <section id="experience" className="py-16">
      <h2 className="text-2xl font-semibold">
        {locale === 'zh' ? '经历' : 'Experience'}
      </h2>
      <ol className="mt-8 space-y-6 border-l border-slate-200 pl-6 dark:border-slate-700">
        {list.map((item) => (
          <li key={`${item.company}-${item.timeframe}`} className="relative">
            <span className="absolute -left-3 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-xs text-white">
              ●
            </span>
            <div className="rounded-xl border border-slate-200 bg-white/60 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  <Link href={item.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Image
                      src={item.logo}
                      alt={`${item.company} logo`}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                  </Link>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {item.title} ·{' '}
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline"
                      >
                        {item.company}
                      </Link>
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>• {highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-wide text-slate-500 sm:text-right">
                  {item.timeframe}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
