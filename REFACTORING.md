# 项目重构文档

## 重构概述

本次重构主要针对博客系统进行了全面优化，以支持未来大量论文内容的扩展需求。重构遵循以下原则：

- **可扩展性**：支持未来100+篇论文内容
- **可维护性**：清晰的内容组织和类型安全
- **用户体验**：完善的过滤、分页和搜索功能
- **开发体验**：提供便捷的内容管理脚本

## 重构内容

### 1. 内容分类体系 ✅

#### 变更前
```
src/content/blog/posts/
├── videoarm-cvpr.zh.md
├── videoarm-cvpr.en.md
├── undergraduate-thesis.zh.md
├── undergraduate-thesis.en.md
└── jiangnan-garden-modeling.zh.md
```

所有文章平铺在同一目录，无法区分类型。

#### 变更后
```
src/content/blog/posts/
├── papers/           # 研究论文
│   ├── videoarm-cvpr.zh.md
│   ├── videoarm-cvpr.en.md
│   ├── undergraduate-thesis.zh.md
│   └── undergraduate-thesis.en.md
├── notes/            # 学习笔记
│   ├── jiangnan-garden-modeling.zh.md
│   └── jiangnan-garden-modeling.en.md
└── tutorials/        # 技术教程
```

**优势**：
- 清晰的内容分类
- 便于管理和查找
- 自动从路径提取类别

---

### 2. 类型系统增强 ✅

创建了完整的类型定义系统 (`src/types/blog.ts`)：

#### 新增类型

```typescript
// 分类枚举
export type BlogCategory = 'papers' | 'notes' | 'tutorials';

// 发表状态
export type PublicationStatus = 'published' | 'under-review' | 'preprint' | 'workshop';

// 作者信息
export interface Author {
  name: string;
  affiliation?: string;
  url?: string;
}

// 扩展的 Frontmatter
export interface BlogFrontmatter {
  // 基础字段
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: BlogCategory;

  // 论文特定字段
  venue?: string;
  status?: PublicationStatus;
  authors?: Author[];
  arxiv?: string;
  pdf?: string;
  github?: string;
  project_page?: string;
  doi?: string;
  year?: number;
  area?: string;
  citation_count?: number;
  bibtex?: string;

  // 元数据
  readingTime?: number;
}
```

**优势**：
- 完整的类型安全
- 支持论文特定字段
- 自动化元数据管理

---

### 3. 内容验证系统 ✅

使用 Zod 进行运行时验证：

```typescript
import { z } from 'zod';

export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  summary: z.string().min(1, 'Summary is required'),
  tags: z.array(z.string()).default([]),
  category: z.enum(['papers', 'notes', 'tutorials']).default('notes'),
  venue: z.string().optional(),
  // ... 其他字段
});
```

**功能**：
- 自动验证 frontmatter 格式
- 提供清晰的错误提示
- 防止无效数据

**相关文件**：`src/types/blog.ts`

---

### 4. Blog 系统核心优化 ✅

#### 新增功能

**递归读取子目录**：
```typescript
function getMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}
```

**自动提取分类**：
```typescript
function getCategoryFromPath(filePath: string): BlogCategory {
  const relativePath = path.relative(postsDirectory, filePath);
  const parts = relativePath.split(path.sep);
  if (parts.length > 1) {
    const category = parts[0];
    if (['papers', 'notes', 'tutorials'].includes(category)) {
      return category as BlogCategory;
    }
  }
  return 'notes'; // 默认分类
}
```

**阅读时间计算**：
```typescript
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

#### 新增 API 函数

```typescript
// 获取所有文章（带分类和阅读时间）
export function getAllPosts(locale: 'zh' | 'en'): BlogPostMetadata[]

// 按分类获取
export function getPostsByCategory(category: BlogCategory, locale: 'zh' | 'en'): BlogPostMetadata[]

// 过滤和分页
export function getFilteredPosts(
  locale: 'zh' | 'en',
  options: BlogListingOptions
): PaginatedResults<BlogPostMetadata>

// 获取所有标签
export function getAllTags(locale: 'zh' | 'en'): string[]

// 获取所有年份
export function getAllYears(locale: 'zh' | 'en'): number[]

// 获取所有会议/期刊
export function getAllVenues(locale: 'zh' | 'en'): string[]

// 获取最新文章
export function getRecentPosts(locale: 'zh' | 'en', limit: number = 3): BlogPostMetadata[]

// 获取相关文章（基于标签）
export function getRelatedPosts(
  currentSlug: string,
  locale: 'zh' | 'en',
  limit: number = 3
): BlogPostMetadata[]
```

**相关文件**：`src/lib/blog.ts`

---

### 5. 博客页面功能增强 ✅

#### 分页和过滤系统

创建了客户端过滤组件 (`src/components/blog-listing-client.tsx`)：

**功能特性**：
- ✅ **分类过滤**：论文 / 笔记 / 教程
- ✅ **标签过滤**：点击标签筛选相关文章
- ✅ **年份过滤**：按发布年份筛选
- ✅ **会议过滤**：针对论文类别的会议/期刊筛选
- ✅ **分页**：每页10篇，智能分页导航
- ✅ **文章计数**：显示筛选后的文章总数
- ✅ **一键清除**：清除所有筛选条件

**技术实现**：
- 使用 `useSearchParams` 管理 URL 查询参数
- 使用 `useMemo` 优化过滤性能
- 使用 `Suspense` 包裹客户端组件以支持静态导出

**相关文件**：
- `src/components/blog-listing-client.tsx`
- `src/app/blog/page.tsx`
- `src/app/en/blog/page.tsx`

#### 博客详情页优化

**新增功能**：
- ✅ 显示阅读时间
- ✅ 完善的 Open Graph 元数据
- ✅ 更好的错误处理（notFound）

**相关文件**：
- `src/app/blog/[slug]/page.tsx`
- `src/app/en/blog/[slug]/page.tsx`

---

### 6. 内容管理脚本 ✅

为了方便创建和导入内容，提供了两个交互式脚本：

#### 6.1 创建文章脚本

**命令**：`npm run create-post`

**功能**：
- 交互式创建新文章
- 自动生成中英文模板
- 支持三种分类（论文/笔记/教程）
- 论文类别自动添加特定字段
- 自动生成日期

**使用示例**：
```bash
$ npm run create-post

📝 创建新的博客文章 / Create New Blog Post

文章 slug: my-awesome-paper-2024
选择分类: 1 (论文)
中文标题: 我的精彩论文
英文标题: My Awesome Paper
中文摘要: 这是一篇关于...的论文
英文摘要: This is a paper about...
标签: 计算机视觉,深度学习
会议/期刊: CVPR 2025

✅ 文章创建成功！
📝 中文: src/content/blog/posts/papers/my-awesome-paper-2024.zh.md
📝 英文: src/content/blog/posts/papers/my-awesome-paper-2024.en.md
```

**相关文件**：`scripts/create-post.js`

#### 6.2 导入论文脚本

**命令**：`npm run import-paper <arxiv-id>`

**功能**：
- 从 arXiv 自动获取论文元数据
- 自动提取标题、摘要、作者、日期
- 自动生成标签（基于 arXiv 分类）
- 交互式补充中文信息
- 自动生成双语文件

**使用示例**：
```bash
$ npm run import-paper 2404.12345

📥 正在从 arXiv 获取元数据...
✅ 成功获取论文元数据:
📝 标题: VideoARM: Agentic Reasoning...
📅 发布日期: 2024-11-15
👥 作者: Zhang San, Li Si
🏷️  标签: 计算机视觉, 多模态

文章 slug: videoarm-2024
中文标题: [留空使用原标题]
中文摘要: 提出基于层次化记忆...
会议/期刊: CVPR 2025
GitHub: https://github.com/...

✅ 论文导入成功！
📝 中文: src/content/blog/posts/papers/videoarm-2024.zh.md
📝 英文: src/content/blog/posts/papers/videoarm-2024.en.md
```

**相关文件**：`scripts/import-paper.js`

---

### 7. RSS Feed 和 Sitemap ✅

为了改善 SEO 和用户体验，添加了 RSS 和 Sitemap 支持：

#### RSS Feed

**访问地址**：`/feed.xml`

**功能**：
- 包含最新 20 篇文章
- 包含标题、摘要、标签
- 符合 RSS 2.0 标准

**相关文件**：`src/app/feed.xml/route.ts`

#### Sitemap

**访问地址**：`/sitemap.xml`

**功能**：
- 包含所有静态页面
- 包含所有博客文章（中英文）
- 自动设置优先级和更新频率

**相关文件**：`src/app/sitemap.xml/route.ts`

---

## 性能优化

### 1. 静态生成

所有博客页面均通过静态生成 (SSG)，构建时一次性生成所有页面：
- ✅ 首页加载速度快
- ✅ SEO 友好
- ✅ 无需服务器渲染

### 2. 客户端过滤

为了支持静态导出同时保留过滤功能：
- 服务端：预加载所有文章数据
- 客户端：使用 `useMemo` 进行高效过滤
- URL：使用 `searchParams` 保持状态

### 3. 代码优化

- 使用 `Suspense` 边界处理 `useSearchParams`
- 递归读取文件时避免重复 I/O
- 类型安全减少运行时错误

---

## 扩展性评估

### 当前架构支持规模

| 文章数量 | 评分 | 说明 |
|---------|------|------|
| < 10 篇 | 10/10 | 完美支持 |
| 10-50 篇 | 9/10 | 优秀支持，分页和过滤可用 |
| 50-100 篇 | 7/10 | 良好支持，建议添加搜索 |
| 100-200 篇 | 6/10 | 可接受，需要优化构建时间 |
| > 200 篇 | 4/10 | 需要引入 CMS 或数据库 |

### 未来扩展建议

当文章数量达到 50+ 篇时，建议：

1. **添加全文搜索**
   - 使用 Flexsearch 或 Pagefind
   - 静态索引，无需后端

2. **优化构建性能**
   - 使用 Contentlayer 自动化处理
   - 增量构建支持

3. **引入 CMS（100+ 篇时）**
   - Sanity 或 Strapi
   - 可视化管理界面
   - API 驱动的内容

---

## 未来功能规划

### 短期（1-3个月）

- [ ] **搜索功能**：Flexsearch 或 Pagefind
- [ ] **标签聚合页**：`/blog/tags/[tag]` 路由
- [ ] **RSS 订阅优化**：支持分类 RSS
- [ ] **相关文章推荐**：在文章页显示相关内容
- [ ] **双语路由优化**：消除代码重复

### 中期（3-6个月）

- [ ] **内容统计**：文章数量、标签云、时间线
- [ ] **引入 Contentlayer**：自动化内容处理
- [ ] **图片优化**：自动压缩和 WebP 转换
- [ ] **评论系统增强**：Giscus 主题优化

### 长期（6个月+）

- [ ] **Headless CMS**：Sanity 或 Strapi
- [ ] **高级搜索**：Algolia 或 Meilisearch
- [ ] **多作者支持**：作者页面和筛选
- [ ] **系列文章**：支持文章系列组织

---

## 技术栈总结

### 依赖变化

**新增依赖**：
```json
{
  "zod": "^4.2.1"  // 运行时类型验证
}
```

**未使用依赖（建议移除）**：
```json
{
  "next-intl": "3.15.0"  // 已安装但未使用
}
```

### 文件变更统计

**新增文件**：
- `src/types/blog.ts` - 类型定义
- `src/components/blog-listing-client.tsx` - 客户端过滤组件
- `src/app/feed.xml/route.ts` - RSS Feed
- `src/app/sitemap.xml/route.ts` - Sitemap
- `scripts/create-post.js` - 创建文章脚本
- `scripts/import-paper.js` - 导入论文脚本

**修改文件**：
- `src/lib/blog.ts` - 完全重写
- `src/app/blog/page.tsx` - 使用新组件
- `src/app/en/blog/page.tsx` - 使用新组件
- `src/app/blog/[slug]/page.tsx` - 添加元数据和错误处理
- `src/app/en/blog/[slug]/page.tsx` - 添加元数据和错误处理
- `src/sections/blog-section.tsx` - 使用 `getRecentPosts`
- `package.json` - 添加脚本命令

**目录结构变化**：
- `src/content/blog/posts/` → 添加子目录 `papers/`, `notes/`, `tutorials/`

---

## 迁移指南

### 现有文章迁移

所有现有文章已自动迁移到新的分类目录：
- `videoarm-cvpr.*` → `papers/`
- `undergraduate-thesis.*` → `papers/`
- `jiangnan-garden-modeling.*` → `notes/`

### 创建新文章

**推荐方式**：使用脚本
```bash
npm run create-post
```

**手动方式**：
1. 在对应分类目录下创建文件
2. 确保 frontmatter 包含所需字段
3. 文件命名：`{slug}.{locale}.md`

### 导入 arXiv 论文

```bash
npm run import-paper 2404.12345
```

然后编辑生成的文件，补充个人见解。

---

## 常见问题

### Q1: 如何添加新的文章分类？

1. 更新 `src/types/blog.ts` 中的 `BlogCategoryEnum`
2. 在 `posts/` 下创建新目录
3. 更新 `blog-listing-client.tsx` 中的 `categoryLabels`

### Q2: 如何修改每页显示的文章数量？

编辑 `src/components/blog-listing-client.tsx`：
```typescript
const perPage = 10; // 修改为你想要的数量
```

### Q3: 如何自定义 RSS Feed？

编辑 `src/app/feed.xml/route.ts`，修改：
- `siteUrl`：网站地址
- `slice(0, 20)`：RSS 包含的文章数量
- 标题、描述等元信息

### Q4: 如何添加更多论文特定字段？

1. 更新 `src/types/blog.ts` 中的 `BlogFrontmatterSchema`
2. 在 `blog-card.tsx` 中添加显示逻辑
3. 在 `create-post.js` 中添加交互式输入

---

## 总结

本次重构成功实现了：

✅ **清晰的内容组织**：三级分类体系（papers/notes/tutorials）
✅ **完整的类型系统**：TypeScript + Zod 运行时验证
✅ **强大的过滤功能**：分类、标签、年份、会议多维度筛选
✅ **便捷的内容管理**：交互式脚本快速创建和导入
✅ **完善的 SEO**：RSS Feed + Sitemap
✅ **良好的扩展性**：支持未来 100+ 篇论文

项目现在已经做好了大规模扩展的准备，可以轻松管理未来的大量论文内容！
