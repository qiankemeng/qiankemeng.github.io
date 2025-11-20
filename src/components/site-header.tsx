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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href={isEnglish ? '/en' : '/'} className="font-semibold">
          {isEnglish ? 'Meng Qianke' : '孟乾轲'}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={isHomePage ? item.href : (isEnglish ? `/en${item.href}` : item.href)}
              className="hover:text-[var(--accent)]"
            >
              {isEnglish ? item.labelEn : item.labelZh}
            </Link>
          ))}
          {pageNavItems.map((item) => (
            <Link key={item.href} href={isEnglish ? item.hrefEn : item.href} className="hover:text-[var(--accent)]">
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
