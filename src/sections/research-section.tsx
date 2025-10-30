import researchZh from '@/content/research/overview.zh.json';
import researchEn from '@/content/research/overview.en.json';

interface FocusItem {
  title: string;
  description: string;
}

interface ResearchOverview {
  headline: string;
  summary: string;
  focus: FocusItem[];
}

export function ResearchSection({ locale }: { locale: 'zh' | 'en' }) {
  const overview = (locale === 'zh' ? researchZh : researchEn) as ResearchOverview;

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
      </div>
    </section>
  );
}
