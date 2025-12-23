'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { BlogPostMetadata, BlogCategory } from '@/types/blog';

interface BlogCardProps {
  post: BlogPostMetadata;
  locale: 'zh' | 'en';
}

const categoryLabels: Record<BlogCategory, { zh: string; en: string }> = {
  research: { zh: '我的研究', en: 'My Research' },
  'daily-papers': { zh: 'AI精选', en: 'AI Curated' },
  tutorials: { zh: '技术教程', en: 'Tutorials' },
  notes: { zh: '学习笔记', en: 'Notes' },
  others: { zh: '杂项', en: 'Others' }
};

function BlogCard({ post, locale }: BlogCardProps) {
  const baseUrl = locale === 'zh' ? '' : '/en';
  const readMore = locale === 'zh' ? '阅读全文' : 'Read more';

  return (
    <article className="rounded-2xl border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700">
      <div className="flex items-center justify-between">
        <time className="text-xs uppercase tracking-wide text-slate-400">
          {post.date}
        </time>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {categoryLabels[post.category][locale]}
        </span>
      </div>

      <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
        <a
          href={`${baseUrl}/blog/${post.slug}`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          {post.title}
        </a>
      </h2>

      {/* Paper-specific metadata */}
      {(post.category === 'research' || post.category === 'daily-papers') && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
          {post.venue && (
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {post.venue}
            </span>
          )}
          {post.status && (
            <span className="capitalize">
              • {post.status.replace('-', ' ')}
            </span>
          )}
        </div>
      )}

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {post.summary}
      </p>

      {/* Tags */}
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

      {/* Paper links */}
      {(post.category === 'research' || post.category === 'daily-papers') && (
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {post.pdf && (
            <a
              href={post.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              PDF
            </a>
          )}
          {post.arxiv && (
            <a
              href={post.arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              arXiv
            </a>
          )}
          {post.github && (
            <a
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <a
          href={`${baseUrl}/blog/${post.slug}`}
          className="inline-block text-[var(--accent)] hover:underline"
        >
          {readMore} →
        </a>
        {post.readingTime && (
          <span className="text-slate-400">
            {post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}
          </span>
        )}
      </div>
    </article>
  );
}

interface BlogListingClientProps {
  allPosts: BlogPostMetadata[];
  allTags: string[];
  allYears: number[];
  allVenues: string[];
  locale: 'zh' | 'en';
}

export default function BlogListingClient({
  allPosts,
  allTags,
  allYears,
  allVenues,
  locale
}: BlogListingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = (searchParams.get('category') as BlogCategory | 'all') || 'all';
  const currentTag = searchParams.get('tag');
  const currentYear = searchParams.get('year');
  const currentVenue = searchParams.get('venue');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    if (currentCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === currentCategory);
    }

    if (currentTag) {
      filtered = filtered.filter((post) => post.tags.includes(currentTag));
    }

    if (currentYear) {
      filtered = filtered.filter((post) => post.date.startsWith(currentYear));
    }

    if (currentVenue) {
      filtered = filtered.filter((post) =>
        post.venue?.toLowerCase().includes(currentVenue.toLowerCase())
      );
    }

    return filtered;
  }, [allPosts, currentCategory, currentTag, currentYear, currentVenue]);

  // Pagination
  const perPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / perPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * perPage, currentPage * perPage);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const categoryLabelsAll: Record<BlogCategory | 'all', { zh: string; en: string }> = {
    all: { zh: '全部', en: 'All' },
    research: { zh: '我的研究', en: 'My Research' },
    'daily-papers': { zh: 'AI精选', en: 'AI Curated' },
    tutorials: { zh: '技术教程', en: 'Tutorials' },
    notes: { zh: '学习笔记', en: 'Notes' },
    others: { zh: '杂项', en: 'Others' }
  };

  return (
    <section className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          {locale === 'zh' ? '博客文章' : 'Blog Posts'}
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {locale === 'zh'
            ? '记录技术思考、实验过程与学习心得。'
            : 'Technical thoughts, experiments, and learning notes.'}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {locale === 'zh' ? `共 ${filteredPosts.length} 篇文章` : `${filteredPosts.length} posts total`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
        {/* Main content */}
        <div>
          {paginatedPosts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-12 text-center dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">
                {locale === 'zh' ? '没有找到符合条件的文章' : 'No posts found matching your filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {locale === 'zh' ? '上一页' : 'Previous'}
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-400">
                {locale === 'zh'
                  ? `第 ${currentPage} / ${totalPages} 页`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>

              <button
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {locale === 'zh' ? '下一页' : 'Next'}
              </button>
            </nav>
          )}
        </div>

        {/* Sidebar filters */}
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="space-y-6 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {locale === 'zh' ? '筛选' : 'Filters'}
            </h3>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {locale === 'zh' ? '分类' : 'Category'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'research', 'daily-papers', 'tutorials', 'notes', 'others'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat === 'all' ? null : cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      currentCategory === cat
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {categoryLabelsAll[cat][locale]}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            {allYears.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === 'zh' ? '年份' : 'Year'}
                </label>
                <select
                  value={currentYear || ''}
                  onChange={(e) => updateFilter('year', e.target.value || null)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">{locale === 'zh' ? '全部年份' : 'All years'}</option>
                  {allYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Venue Filter */}
            {allVenues.length > 0 && (currentCategory === 'research' || currentCategory === 'daily-papers') && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === 'zh' ? '会议/期刊' : 'Venue'}
                </label>
                <select
                  value={currentVenue || ''}
                  onChange={(e) => updateFilter('venue', e.target.value || null)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">{locale === 'zh' ? '全部会议' : 'All venues'}</option>
                  {allVenues.map((venue) => (
                    <option key={venue} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === 'zh' ? '标签' : 'Tags'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => updateFilter('tag', currentTag === tag ? null : tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        currentTag === tag
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(currentCategory !== 'all' || currentTag || currentYear || currentVenue) && (
              <button
                onClick={() => router.push(pathname)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {locale === 'zh' ? '清除筛选' : 'Clear filters'}
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
