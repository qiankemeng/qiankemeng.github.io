import postsEn from '@/content/blog/posts.en.json';
import Link from 'next/link';

export default function BlogListingEn() {
  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold">Blog Posts</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Placeholder copy for future long-form writing.
      </p>
      <ul className="mt-10 space-y-6">
        {postsEn.map((post) => (
          <li key={post.slug} className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-700">
            <div className="text-xs uppercase tracking-wide text-slate-400">{post.date}</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.summary}</p>
            <Link href={`/en/blog/${post.slug}`} className="mt-3 inline-block text-sm text-[var(--accent)]">
              Read more
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
