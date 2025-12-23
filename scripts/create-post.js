#!/usr/bin/env node

/**
 * Script to create a new blog post with template
 * Usage: npm run create-post
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

const categories = {
  '1': 'papers',
  '2': 'notes',
  '3': 'tutorials'
};

const categoryLabels = {
  papers: '研究论文 (Research Papers)',
  notes: '学习笔记 (Learning Notes)',
  tutorials: '技术教程 (Tutorials)'
};

async function main() {
  console.log('\n📝 创建新的博客文章 / Create New Blog Post\n');

  // Get slug
  const slug = await question('文章 slug (URL路径，如 "my-paper-2024"): ');
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    console.error('❌ Slug 必须只包含小写字母、数字和连字符');
    rl.close();
    return;
  }

  // Get category
  console.log('\n选择分类 / Select Category:');
  console.log('1. 研究论文 (Research Papers)');
  console.log('2. 学习笔记 (Learning Notes)');
  console.log('3. 技术教程 (Tutorials)');
  const categoryChoice = await question('选择 (1-3): ');
  const category = categories[categoryChoice];

  if (!category) {
    console.error('❌ 无效的分类选择');
    rl.close();
    return;
  }

  // Get title
  const titleZh = await question('\n中文标题: ');
  const titleEn = await question('英文标题: ');

  // Get summary
  const summaryZh = await question('\n中文摘要: ');
  const summaryEn = await question('英文摘要: ');

  // Get tags
  const tagsInput = await question('\n标签 (逗号分隔，如 "视频理解,多模态"): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);

  // Paper-specific fields
  let paperFields = {};
  if (category === 'papers') {
    const venue = await question('\n会议/期刊 (如 "CVPR 2025"，可选): ');
    const arxiv = await question('arXiv链接 (可选): ');
    const github = await question('GitHub链接 (可选): ');
    const pdf = await question('PDF路径 (如 "/papers/paper.pdf"，可选): ');

    paperFields = {
      venue: venue || undefined,
      arxiv: arxiv || undefined,
      github: github || undefined,
      pdf: pdf || undefined,
      status: 'published'
    };
  }

  // Generate date
  const date = new Date().toISOString().split('T')[0];

  // Create frontmatter
  const createFrontmatter = (title, summary, locale) => {
    const fm = {
      title,
      date,
      summary,
      tags,
      ...paperFields
    };

    // Remove undefined values
    Object.keys(fm).forEach(key => fm[key] === undefined && delete fm[key]);

    return `---
${Object.entries(fm).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
  } else if (typeof value === 'string' && value.includes('\n')) {
    return `${key}: |\n  ${value.split('\n').join('\n  ')}`;
  } else {
    return `${key}: "${value}"`;
  }
}).join('\n')}
---`;
  };

  // Create content template
  const createContent = (locale) => {
    if (category === 'papers') {
      return locale === 'zh' ? `

# ${titleZh}

## 研究背景

[在此描述研究背景...]

## 核心创新

[在此描述核心创新点...]

## 方法

[在此描述方法...]

## 实验结果

[在此描述实验结果...]

## 结论

[在此总结...]

` : `

# ${titleEn}

## Background

[Describe research background here...]

## Key Innovations

[Describe key innovations here...]

## Method

[Describe method here...]

## Experimental Results

[Describe experimental results here...]

## Conclusion

[Summarize here...]

`;
    } else {
      return locale === 'zh' ? `

# ${titleZh}

## 简介

[在此介绍...]

## 正文

[在此编写内容...]

## 总结

[在此总结...]

` : `

# ${titleEn}

## Introduction

[Introduce here...]

## Content

[Write content here...]

## Summary

[Summarize here...]

`;
    }
  };

  // Create files
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'blog', 'posts', category);
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const fileZh = path.join(postsDir, `${slug}.zh.md`);
  const fileEn = path.join(postsDir, `${slug}.en.md`);

  // Check if files already exist
  if (fs.existsSync(fileZh) || fs.existsSync(fileEn)) {
    console.error(`\n❌ 文章已存在: ${slug}`);
    rl.close();
    return;
  }

  // Write files
  fs.writeFileSync(fileZh, createFrontmatter(titleZh, summaryZh, 'zh') + createContent('zh'));
  fs.writeFileSync(fileEn, createFrontmatter(titleEn, summaryEn, 'en') + createContent('en'));

  console.log(`\n✅ 文章创建成功！`);
  console.log(`📁 分类: ${categoryLabels[category]}`);
  console.log(`📝 中文: ${fileZh}`);
  console.log(`📝 英文: ${fileEn}`);
  console.log(`\n💡 下一步: 编辑文件内容，然后运行 npm run build 测试\n`);

  rl.close();
}

main().catch((error) => {
  console.error('❌ 错误:', error);
  rl.close();
  process.exit(1);
});
