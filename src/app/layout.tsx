import './globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/cn';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: {
    default: '孟乾轲 | 个人主页',
    template: '%s | 孟乾轲'
  },
  description: '孟乾轲的个人主页，展示多模态大模型、Agent 系统、长视频理解、视频问答与 3D 视觉定位方向的科研成果、项目与联系信息。'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased')}>
        <Providers>
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 sm:px-8 sm:py-10">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
