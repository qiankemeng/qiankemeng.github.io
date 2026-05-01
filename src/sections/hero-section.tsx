import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { value: 'CVPR 2026', labelZh: '长视频推理', labelEn: 'Long-video reasoning' },
  { value: 'ICME 2026', labelZh: '视频压缩智能体', labelEn: 'Video condensation agent' },
  { value: 'MLLM Agent', labelZh: '研究主线', labelEn: 'Research thread' }
];

export function HeroSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        tagline: '长视频理解 · 多模态智能体',
        title: ['面向长视频理解的', '多模态智能体研究'],
        intro: '你好，我是孟乾轲，杭州电子科技大学硕士研究生。当前聚焦多模态大模型、Agent 系统、长视频理解与视频问答，持续构建可复现的长视频多 Agent 研究与实验基础设施。',
        actionPortfolio: '查看研究与项目',
        actionResume: '下载中文简历',
        status: '近期工作发表于 CVPR 2026 与 ICME 2026',
        avatarAlt: '孟乾轲'
      }
    : {
        tagline: 'Long-Video Understanding · Multimodal Agents',
        title: ['Multimodal agent research', 'for long-form video understanding'],
        intro: 'I am Meng Qianke, a master\'s student at Hangzhou Dianzi University. My work focuses on multimodal large models, agent systems, long-video understanding, and video QA, with an emphasis on reproducible research infrastructure.',
        actionPortfolio: 'View research & projects',
        actionResume: 'Download résumé',
        status: 'Recent work appears at CVPR 2026 and ICME 2026',
        avatarAlt: 'Meng Qianke'
      };

  return (
    <section id="about" className="section-shell pt-8 sm:pt-12">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="section-kicker">{copy.tagline}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.45rem]">
              {copy.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              {copy.intro}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#research" className="pill-link-primary">
                {copy.actionPortfolio}
              </a>
              <Link href="/resume.pdf" className="pill-link text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                {copy.actionResume}
              </Link>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">{copy.status}</p>
          </div>
          <div className="relative">
            <div className="mx-auto max-w-[21rem] rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-xl shadow-black/10">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--accent-soft)]">
                <Image
                  src="/images/avatars/avatar.png"
                  alt={copy.avatarAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 320px, 380px"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                  <div key={stat.value} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                    <div className="text-xs font-semibold text-[var(--foreground)]">{stat.value}</div>
                    <div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
                      {locale === 'zh' ? stat.labelZh : stat.labelEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
