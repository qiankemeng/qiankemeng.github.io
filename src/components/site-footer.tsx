import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>© {new Date().getFullYear()} qiankemeng. 保留所有权利。</p>
        <div className="flex items-center gap-4">
          <Link href="mailto:hello@qiankemeng.com">Email</Link>
          <Link href="https://github.com/qiankemeng">GitHub</Link>
          <Link href="https://www.linkedin.com">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
