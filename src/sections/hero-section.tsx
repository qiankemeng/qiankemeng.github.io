import Image from 'next/image';
import Link from 'next/link';

export function HeroSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        tagline: '多模态大模型研究',
        title: '你好，我是孟乾轲',
        subtitle: '2002 年出生的多模态大模型研究者，聚焦视觉与语言融合的生成智能。',
        actionPortfolio: '查看作品集',
        actionResume: '下载简历'
      }
    : {
        tagline: 'Multimodal AI Research',
        title: "Hi, I'm Meng Qianke",
        subtitle: 'Born in 2002, a multimodal large-model researcher exploring vision-language intelligence.',
        actionPortfolio: 'View portfolio',
        actionResume: 'Download résumé'
      };

  return (
    <section id="about" className="flex flex-col-reverse gap-8 py-12 sm:flex-row sm:items-center">
      <div className="flex-1 space-y-6">
        <p className="text-sm uppercase tracking-wide text-[var(--accent)]">
          {copy.tagline}
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{copy.title}</h1>
        <p className="max-w-xl text-base text-slate-600 dark:text-slate-300">
          {copy.subtitle}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#projects"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white shadow hover:opacity-90"
          >
            {copy.actionPortfolio}
          </a>
          <Link
            href="/resume.pdf"
            className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm font-semibold hover:bg-slate-100"
          >
            {copy.actionResume}
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border border-slate-200 shadow-lg">
          <Image
            src="/images/avatars/avatar.png"
            alt={locale === 'zh' ? '孟乾轲' : 'Meng Qianke'}
            fill
            sizes="(max-width: 640px) 192px, 240px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
