'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

interface CommentsSectionProps {
  locale: 'zh' | 'en';
}

export function CommentsSection({ locale }: CommentsSectionProps) {
  const { theme } = useTheme();

  return (
    <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-700">
      <h2 className="mb-6 text-2xl font-semibold">
        {locale === 'zh' ? '💬 评论' : '💬 Comments'}
      </h2>
      <Giscus
        repo="qiankemeng/qiankemeng.github.io"
        repoId="R_kgDONUqHsQ"
        category="Announcements"
        categoryId="DIC_kwDONUqHsc4Ck6A8"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'dark' : 'light'}
        lang={locale === 'zh' ? 'zh-CN' : 'en'}
        loading="lazy"
      />
    </div>
  );
}
