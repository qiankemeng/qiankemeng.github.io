import postsZh from '@/content/blog/posts.zh.json';
import postsEn from '@/content/blog/posts.en.json';
import Link from 'next/link';

interface PostBrief {
  title: string;
  summary: string;
  date: string;
  slug: string;
}

function formatDate(date: string, locale: 'zh' | 'en') {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function BlogSection({ locale }: { locale: 'zh' | 'en' }) {
  const posts = (locale === 'zh' ? postsZh : postsEn) as PostBrief[];

  return (
    <section id="blog" className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {locale === 'zh' ? '最新文章' : 'Latest Writing'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {locale === 'zh'
              ? '记录产品思考、工程实践与学习笔记。'
              : 'Notes on product thinking, engineering practices, and learning.'}
          </p>
        </div>
        <Link href={locale === 'zh' ? '/blog' : '/en/blog'} className="text-sm">
          {locale === 'zh' ? '阅读更多' : 'Read more'}
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60"
          >
            <time className="text-xs uppercase tracking-wide text-slate-400">
              {formatDate(post.date, locale)}
            </time>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {post.summary}
            </p>
            <Link
              href={(locale === 'zh' ? '/blog' : '/en/blog') + `/${post.slug}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent)]"
            >
              {locale === 'zh' ? '阅读全文' : 'Read article'}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
