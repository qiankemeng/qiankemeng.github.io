import Link from 'next/link';

export function ContactSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        heading: '联系与合作',
        description: '欢迎就多模态大模型研究、科研合作或个人项目与我交流。',
        cta: '发送邮件'
      }
    : {
        heading: 'Get in touch',
        description: 'Let’s connect around multimodal research, collaborations, or personal projects.',
        cta: 'Drop an email'
      };

  return (
    <section id="contact" className="py-16">
      <div className="rounded-2xl border border-slate-200 bg-white/60 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-2xl font-semibold">{copy.heading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {copy.description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="mailto:mengqianke1@gmail.com"
            className="rounded-full bg-[var(--accent)] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            {copy.cta}
          </Link>
          <Link href="https://github.com/qiankemeng" className="rounded-full border border-slate-200 px-5 py-3 hover:bg-slate-100">
            GitHub
          </Link>
          <Link href="https://www.linkedin.com" className="rounded-full border border-slate-200 px-5 py-3 hover:bg-slate-100">
            LinkedIn
          </Link>
          <Link href="https://twitter.com" className="rounded-full border border-slate-200 px-5 py-3 hover:bg-slate-100">
            Twitter
          </Link>
        </div>
      </div>
    </section>
  );
}
