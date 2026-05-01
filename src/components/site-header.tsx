'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocaleSwitcher } from '@/components/site-locale-switcher';
import { ThemeSwitcher } from '@/components/site-theme-switcher';

const navItems = [
  { href: '#about', labelZh: '简介', labelEn: 'About' },
  { href: '#research', labelZh: '科研', labelEn: 'Research' },
  { href: '#projects', labelZh: '项目', labelEn: 'Projects' },
  { href: '#experience', labelZh: '经历', labelEn: 'Experience' },
  { href: '#contact', labelZh: '联系', labelEn: 'Contact' }
];

const pageNavItems = [
  { href: '/blog', hrefEn: '/en/blog', labelZh: '博客', labelEn: 'Blog' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');
  const isHomePage = pathname === '/' || pathname === '/en';

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-2.5 sm:px-8">
        <Link href={isEnglish ? '/en' : '/'} className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--accent)] shadow-sm">
            QK
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {isEnglish ? 'Meng Qianke' : '孟乾轲'}
            </span>
            <span className="block text-xs text-[var(--muted)]">
              {isEnglish ? 'Long-video MLLM research' : '长视频多模态研究'}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-sm font-medium text-[var(--muted)] shadow-sm lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={isHomePage ? item.href : (isEnglish ? `/en${item.href}` : item.href)}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {isEnglish ? item.labelEn : item.labelZh}
            </Link>
          ))}
          {pageNavItems.map((item) => (
            <Link
              key={item.href}
              href={isEnglish ? item.hrefEn : item.href}
              className="rounded-full px-3 py-1.5 hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]"
            >
              {isEnglish ? item.labelEn : item.labelZh}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
