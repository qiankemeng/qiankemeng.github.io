import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog/posts');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

/**
 * Get all blog posts for a specific locale
 */
export function getAllPosts(locale: 'zh' | 'en'): BlogPostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(`.${locale}.md`))
    .map((fileName) => {
      const slug = fileName.replace(`.${locale}.md`, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        summary: data.summary,
        tags: data.tags || []
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // Sort by date descending

  return posts;
}

/**
 * Get a single blog post by slug and locale
 */
export function getPostBySlug(slug: string, locale: 'zh' | 'en'): BlogPost {
  const fullPath = path.join(postsDirectory, `${slug}.${locale}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags || [],
    content
  };
}

/**
 * Get all post slugs
 */
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const slugs = new Set<string>();

  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md')) {
      const slug = fileName.replace(/\.(zh|en)\.md$/, '');
      slugs.add(slug);
    }
  });

  return Array.from(slugs);
}
