import Link from 'next/link';
import Image from 'next/image';
import { Mail, Github, Linkedin, Twitter, MessageSquare, QrCode } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function ContactSection({ locale }: { locale: 'zh' | 'en' }) {
  const copy = locale === 'zh'
    ? {
        heading: '联系与合作',
        description: '欢迎就多模态大模型研究、科研合作或个人项目与我交流。',
        directContact: '直接联系',
        socialMedia: '社交媒体',
        qrCodesTitle: '扫码联系',
        wechat: '微信',
        xiaohongshu: '小红书',
        x: 'X',
        scanToAdd: '扫码添加',
      }
    : {
        heading: 'Get in touch',
        description: "Let's connect around multimodal research, collaborations, or personal projects.",
        directContact: 'Direct Contact',
        socialMedia: 'Social Media',
        qrCodesTitle: 'Scan to Connect',
        wechat: 'WeChat',
        xiaohongshu: 'Xiaohongshu',
        x: 'X',
        scanToAdd: 'Scan to add',
      };

  return (
    <section id="contact" className="py-16">
      <div className="rounded-2xl border border-slate-200 bg-white/60 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 md:p-10">
        <h2 className="text-center text-2xl font-semibold">{copy.heading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-300">
          {copy.description}
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Left: Contact Methods */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Mail className="h-4 w-4" />
                {copy.directContact}
              </h3>
              <Link
                href={`mailto:${siteConfig.author.email}`}
                className="group flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-[var(--accent)] hover:bg-slate-50 dark:border-slate-700 dark:hover:border-[var(--accent)] dark:hover:bg-slate-800"
              >
                <div className="rounded-full bg-[var(--accent)]/10 p-2 text-[var(--accent)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{siteConfig.author.email}</div>
                </div>
              </Link>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <MessageSquare className="h-4 w-4" />
                {copy.socialMedia}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-[var(--accent)] hover:bg-slate-50 dark:border-slate-700 dark:hover:border-[var(--accent)] dark:hover:bg-slate-800"
                >
                  <Github className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium">GitHub</span>
                </Link>
                <Link
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-[var(--accent)] hover:bg-slate-50 dark:border-slate-700 dark:hover:border-[var(--accent)] dark:hover:bg-slate-800"
                >
                  <Linkedin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </Link>
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-[var(--accent)] hover:bg-slate-50 dark:border-slate-700 dark:hover:border-[var(--accent)] dark:hover:bg-slate-800"
                >
                  <Twitter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium">Twitter</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: QR Codes */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <QrCode className="h-4 w-4" />
              {copy.qrCodesTitle}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* WeChat QR Code */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={siteConfig.qrcodes.wechat}
                    alt={`${copy.wechat} QR Code`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 text-sm font-medium">{copy.wechat}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{copy.scanToAdd}</div>
              </div>

              {/* Xiaohongshu QR Code */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={siteConfig.qrcodes.xiaohongshu}
                    alt={`${copy.xiaohongshu} QR Code`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 text-sm font-medium">{copy.xiaohongshu}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{copy.scanToAdd}</div>
              </div>

              {/* X QR Code */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={siteConfig.qrcodes.x}
                    alt={`${copy.x} QR Code`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 text-sm font-medium">{copy.x}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{copy.scanToAdd}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

