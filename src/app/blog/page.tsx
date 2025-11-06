import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';

export default function BlogListingZh() {
  const posts = getAllPosts('zh');

  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold">博客文章</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        记录技术思考、实验过程与学习心得。
      </p>
      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-700">
            <div className="text-xs uppercase tracking-wide text-slate-400">{post.date}</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
              阅读全文 →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
