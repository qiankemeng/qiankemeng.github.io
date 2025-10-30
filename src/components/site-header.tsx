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
  { href: '#blog', labelZh: '博客', labelEn: 'Blog' },
  { href: '#contact', labelZh: '联系', labelEn: 'Contact' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href={isEnglish ? '/en' : '/'} className="font-semibold">
          {isEnglish ? 'Meng Qianke' : '孟乾轲'}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--accent)]">
              {isEnglish ? item.labelEn : item.labelZh}
            </a>
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
