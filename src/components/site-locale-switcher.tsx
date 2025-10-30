'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function translatePath(pathname: string, targetLocale: 'zh' | 'en') {
  if (targetLocale === 'en') {
    return pathname === '/' ? '/en' : pathname.startsWith('/en') ? pathname : `/en${pathname}`;
  }

  return pathname === '/en' ? '/' : pathname.replace(/^\/en/, '') || '/';
}

export function LocaleSwitcher() {
  const pathname = usePathname() ?? '/';
  const isEnglish = pathname.startsWith('/en');
  const targetLocale = isEnglish ? 'zh' : 'en';
  const nextPath = translatePath(pathname, targetLocale);

  return (
    <Link
      href={nextPath}
      className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-wide hover:bg-slate-100"
    >
      {targetLocale}
    </Link>
  );
}
