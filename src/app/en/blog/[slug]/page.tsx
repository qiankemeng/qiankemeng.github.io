import postsEn from '@/content/blog/posts.en.json';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default function BlogPostEn({ params }: Props) {
  const post = postsEn.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="prose prose-slate dark:prose-invert">
      <h1>{post.title}</h1>
      <p className="text-sm text-slate-400">{post.date}</p>
      <p>Placeholder content. Replace this section with the actual article body in English.</p>
    </article>
  );
}
