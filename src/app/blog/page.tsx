import postsZh from '@/content/blog/posts.zh.json';
import Link from 'next/link';

export default function BlogListingZh() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold">博客文章</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        占位内容：后续将更新为真实的长文或短记。
      </p>
      <ul className="mt-10 space-y-6">
        {postsZh.map((post) => (
          <li key={post.slug} className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-700">
            <div className="text-xs uppercase tracking-wide text-slate-400">{post.date}</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.summary}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-[var(--accent)]">
              阅读全文
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
