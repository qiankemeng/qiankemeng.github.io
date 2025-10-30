import postsZh from '@/content/blog/posts.zh.json';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return postsZh.map((post) => ({ slug: post.slug }));
}

export default function BlogPostZh({ params }: Props) {
  const post = postsZh.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-slate dark:prose-invert">
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-400">{post.date}</p>
      <p>
        占位内容：未来将补充关于多模态大模型实验设置、数据处理流程以及指标分析的完整文章。
      </p>
    </article>
  );
}
