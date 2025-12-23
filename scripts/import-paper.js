#!/usr/bin/env node

/**
 * Script to import paper information from arXiv or DOI
 * Usage: npm run import-paper <arxiv-id or doi>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
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

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchArxivMetadata(arxivId) {
  // Clean arXiv ID
  const cleanId = arxivId.replace('https://arxiv.org/abs/', '').replace('arxiv:', '');
  const url = `http://export.arxiv.org/api/query?id_list=${cleanId}`;

  console.log(`📥 正在从 arXiv 获取元数据...`);

  const xml = await httpsGet(url);

  // Parse XML (simple regex parsing)
  const title = xml.match(/<title>(.+?)<\/title>/s)?.[1]?.trim().replace(/\n\s+/g, ' ');
  const summary = xml.match(/<summary>(.+?)<\/summary>/s)?.[1]?.trim().replace(/\n\s+/g, ' ');
  const published = xml.match(/<published>(.+?)<\/published>/)?.[1]?.split('T')[0];
  const authors = [...xml.matchAll(/<name>(.+?)<\/name>/g)].map(m => m[1]);

  // Extract categories/tags
  const categories = xml.match(/<category term="(.+?)"\/>/g) || [];
  const tags = categories.map(c => c.match(/term="(.+?)"/)[1])
    .map(tag => {
      // Convert arXiv categories to readable tags
      const categoryMap = {
        'cs.CV': '计算机视觉',
        'cs.AI': '人工智能',
        'cs.LG': '机器学习',
        'cs.CL': '自然语言处理',
        'cs.MM': '多媒体',
        'cs.RO': '机器人',
      };
      return categoryMap[tag] || tag;
    });

  return {
    title,
    summary,
    date: published,
    authors: authors.map(name => ({ name })),
    tags,
    arxiv: `https://arxiv.org/abs/${cleanId}`,
    pdf: `https://arxiv.org/pdf/${cleanId}.pdf`
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📄 从 arXiv 导入论文

用法:
  npm run import-paper <arxiv-id>
  npm run import-paper 2404.12345
  npm run import-paper https://arxiv.org/abs/2404.12345

示例:
  npm run import-paper 2404.12345
`);
    rl.close();
    return;
  }

  const input = args[0];

  try {
    let metadata;

    // Detect source
    if (input.includes('arxiv') || /^\d{4}\.\d{4,5}(v\d+)?$/.test(input)) {
      metadata = await fetchArxivMetadata(input);
    } else {
      console.error('❌ 暂不支持此来源，目前仅支持 arXiv');
      rl.close();
      return;
    }

    if (!metadata.title) {
      console.error('❌ 无法获取论文元数据，请检查 ID 是否正确');
      rl.close();
      return;
    }

    console.log('\n✅ 成功获取论文元数据:');
    console.log(`📝 标题: ${metadata.title}`);
    console.log(`📅 发布日期: ${metadata.date}`);
    console.log(`👥 作者: ${metadata.authors.map(a => a.name).join(', ')}`);
    console.log(`🏷️  标签: ${metadata.tags.join(', ')}`);

    // Ask for additional info
    console.log('\n请提供额外信息:');
    const slug = await question('\n文章 slug (如 "paper-name-2024"): ');
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      console.error('❌ Slug 必须只包含小写字母、数字和连字符');
      rl.close();
      return;
    }

    const titleZh = await question('中文标题 (留空使用原标题): ') || metadata.title;
    const summaryZh = await question('中文摘要 (留空使用原摘要): ') || metadata.summary;
    const venue = await question('会议/期刊 (如 "CVPR 2025", 可选): ');
    const github = await question('GitHub 仓库链接 (可选): ');

    const tagsZh = await question('中文标签 (逗号分隔, 留空使用默认): ');
    const tags = tagsZh ? tagsZh.split(',').map(t => t.trim()) : metadata.tags;

    // Create frontmatter
    const createFrontmatter = (title, summary, locale) => {
      const fm = {
        title,
        date: metadata.date,
        summary,
        tags,
        venue: venue || undefined,
        status: 'preprint',
        authors: metadata.authors,
        arxiv: metadata.arxiv,
        pdf: metadata.pdf,
        github: github || undefined
      };

      // Remove undefined values
      Object.keys(fm).forEach(key => fm[key] === undefined && delete fm[key]);

      return `---
${Object.entries(fm).map(([key, value]) => {
  if (key === 'authors') {
    return `${key}:\n${value.map(a => `  - name: "${a.name}"`).join('\n')}`;
  } else if (Array.isArray(value)) {
    return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
  } else if (typeof value === 'string' && value.length > 80) {
    return `${key}: "${value.substring(0, 200)}..."`;
  } else {
    return `${key}: "${value}"`;
  }
}).join('\n')}
---`;
    };

    // Create content template
    const createContent = (locale) => {
      return locale === 'zh' ? `

# ${titleZh}

> 📄 论文链接: [arXiv](${metadata.arxiv})
${github ? `> 💻 代码仓库: [GitHub](${github})` : ''}

## 摘要

${summaryZh}

## 研究背景

[在此补充研究背景...]

## 核心创新

[在此描述核心创新点...]

## 方法

[在此描述方法...]

## 实验结果

[在此描述实验结果...]

## 个人评价

[在此添加个人见解和评价...]

` : `

# ${metadata.title}

> 📄 Paper: [arXiv](${metadata.arxiv})
${github ? `> 💻 Code: [GitHub](${github})` : ''}

## Abstract

${metadata.summary}

## Background

[Add research background here...]

## Key Innovations

[Describe key innovations here...]

## Method

[Describe method here...]

## Experimental Results

[Describe experimental results here...]

## Personal Review

[Add your insights and review here...]

`;
    };

    // Create files
    const postsDir = path.join(__dirname, '..', 'src', 'content', 'blog', 'posts', 'papers');
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
    fs.writeFileSync(fileEn, createFrontmatter(metadata.title, metadata.summary, 'en') + createContent('en'));

    console.log(`\n✅ 论文导入成功！`);
    console.log(`📝 中文: ${fileZh}`);
    console.log(`📝 英文: ${fileEn}`);
    console.log(`\n💡 下一步: 编辑文件内容，补充个人见解，然后运行 npm run build 测试\n`);

    rl.close();
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
