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
  description: '孟乾轲（2002）从事多模态大模型研究的个人主页，展示科研方向、项目与联系信息。'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-[var(--background)] text-[var(--foreground)]')}>
        <Providers>
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 sm:px-10">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
