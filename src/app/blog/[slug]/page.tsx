import postsZh from '@/content/blog/posts.zh.json';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default function BlogPostZh({ params }: Props) {
  const post = postsZh.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-slate dark:prose-invert">
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-400">{post.date}</p>
      <p>正式内容待补充。这是用于占位的段落，后续将替换为完整文章。</p>
    </article>
  );
}
