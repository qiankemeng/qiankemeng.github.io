# 个人主页与博客系统

[![Deploy](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/deploy.yml)
[![Fetch Papers](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/fetch-papers.yml/badge.svg)](https://github.com/qiankemeng/qiankemeng.github.io/actions/workflows/fetch-papers.yml)

> 基于Next.js 14构建的双语个人主页，集成AI驱动的论文筛选系统和可视化内容管理后台。

🌐 **在线访问**: [https://qiankemeng.github.io](https://qiankemeng.github.io)

---

## ✨ 特性

### 🎨 主站特性

- ✅ **双语支持**：完整的中英文双语界面
- ✅ **响应式设计**：完美适配桌面、平板和手机
- ✅ **暗黑模式**：优雅的明暗主题切换
- ✅ **静态部署**：纯静态站点，部署到GitHub Pages
- ✅ **SEO优化**：完善的元数据和结构化数据
- ✅ **性能优化**：Next.js 14 App Router + 静态导出

### 🤖 AI Agent系统

自动化论文推送系统，每日筛选和总结arXiv最新论文：

- ✅ **自动获取**：每日从arXiv获取最新论文
- ✅ **智能筛选**：使用GPT-4o-mini快速筛选相关论文
- ✅ **深度总结**：使用GPT-4o生成高质量中文总结
- ✅ **双语输出**：同时生成中英文版本
- ✅ **自动发布**：通过GitHub Actions自动创建PR
- ✅ **灵活配置**：支持多种OpenAI兼容API（OpenAI、DeepSeek、Together.ai等）

### 📝 内容管理系统

基于Decap CMS的可视化博客管理后台：

- ✅ **在线编辑**：浏览器中直接编辑Markdown内容
- ✅ **实时预览**：所见即所得的编辑体验
- ✅ **图片管理**：直接上传图片到仓库
- ✅ **工作流管理**：草稿 → 审核 → 发布流程
- ✅ **版本控制**：基于Git的完整历史记录
- ✅ **分类管理**：5大博客分类独立管理

---

## 📁 项目结构

```
.
├── src/
│   ├── app/                    # Next.js页面路由
│   │   ├── layout.tsx          # 根布局（中文）
│   │   ├── page.tsx            # 首页（中文）
│   │   ├── en/                 # 英文路由
│   │   ├── blog/               # 博客路由
│   │   └── projects/           # 项目路由
│   ├── sections/               # 页面区块组件
│   ├── components/             # 可复用组件
│   ├── content/                # 内容数据（JSON）
│   │   ├── blog/
│   │   │   └── posts/          # 博客文章（Markdown）
│   │   │       ├── daily-papers/    # 每日论文
│   │   │       ├── research/        # 研究文章
│   │   │       ├── tutorials/       # 技术教程
│   │   │       ├── notes/           # 学习笔记
│   │   │       └── others/          # 杂项
│   │   ├── projects/           # 项目数据
│   │   └── experience/         # 经历数据
│   ├── lib/                    # 工具函数
│   └── config/                 # 配置文件
├── scripts/
│   └── agent/                  # AI Agent脚本
│       ├── config.js           # 统一配置中心
│       ├── fetcher.js          # arXiv论文获取
│       ├── filter.js           # AI论文筛选
│       ├── summarizer.js       # AI论文总结
│       ├── writer.js           # Markdown文件生成
│       ├── retry-utils.js      # 重试策略工具
│       └── main.js             # 主流程
├── public/
│   ├── admin/                  # CMS管理后台
│   │   ├── config.yml          # CMS配置
│   │   └── index.html          # CMS入口
│   └── images/                 # 静态资源
├── .github/workflows/          # GitHub Actions
│   ├── deploy.yml              # 主站部署
│   └── fetch-papers.yml        # 论文自动获取
├── CMS_SETUP.md                # CMS设置指南
├── GITHUB_ACTIONS_SETUP.md     # GitHub Actions设置指南
└── CLAUDE.md                   # Claude Code项目说明
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Git

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看主站

访问 [http://localhost:3000/admin](http://localhost:3000/admin) 访问CMS管理后台

### 构建生产版本

```bash
npm run build
```

构建输出到 `out/` 目录

### 测试AI Agent

```bash
# 测试arXiv获取
npm run agent:test

# 完整流程测试（获取、筛选、总结、生成文件）
npm run agent:run
```

---

## 📝 博客管理

### 5大博客分类

| 分类 | 说明 | 内容来源 |
|------|------|----------|
| 📄 每日论文 (daily-papers) | AI自动推送的论文总结 | AI Agent自动生成 |
| 🔬 我的研究 (research) | 个人研究成果和论文解读 | 手动创建/CMS |
| 📚 技术教程 (tutorials) | 技术教程和实践指南 | 手动创建/CMS |
| 📝 学习笔记 (notes) | 学习笔记和心得体会 | 手动创建/CMS |
| 🗂️ 杂项 (others) | 其他类型文章 | 手动创建/CMS |

### 使用CMS管理内容

详细设置请参阅 **[CMS_SETUP.md](./CMS_SETUP.md)**

1. **访问管理后台**：`https://你的域名/admin/`
2. **登录认证**：通过GitHub OAuth登录
3. **创建文章**：选择分类 → 新建 → 编辑 → 发布
4. **编辑文章**：在列表中选择文章 → 编辑 → 保存

### 手动创建文章

如果你更喜欢直接编辑文件：

1. 在 `src/content/blog/posts/{category}/` 创建文件
2. 文件名格式：`{slug}.{locale}.md`（如 `my-post.zh.md`）
3. 添加frontmatter元数据：

```markdown
---
title: "文章标题"
date: "2025-12-23"
summary: "简短摘要"
tags: ["标签1", "标签2"]
---

这里是文章内容...
```

4. 提交到GitHub，自动部署

---

## 🤖 配置AI Agent

详细设置请参阅 **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)**

### 环境变量配置

在GitHub仓库的 **Settings → Secrets and variables → Actions** 中配置：

#### 必需配置

- `OPENAI_API_KEY`: OpenAI API密钥

#### 可选配置

```env
# 自定义API端点（支持OpenAI兼容接口）
OPENAI_BASE_URL=https://api.openai.com/v1

# 模型选择
AI_FILTER_MODEL=gpt-4o-mini        # 筛选模型（快速、便宜）
AI_SUMMARIZE_MODEL=gpt-4o          # 总结模型（高质量）

# 筛选参数
MIN_RELEVANCE_SCORE=6              # 最低相关度评分（0-10）
MAX_PAPERS_PER_DAY=5               # 每日最多推送论文数

# 输出控制
GENERATE_ENGLISH=true              # 是否生成英文版本
LOG_LEVEL=info                     # 日志级别
```

### 本地测试Agent

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 填入你的API密钥

3. 运行测试：

```bash
npm run agent:test    # 测试arXiv获取
npm run agent:run     # 完整流程
```

### 使用其他API提供商

#### DeepSeek（成本约1/10）

```env
OPENAI_API_KEY=your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
AI_FILTER_MODEL=deepseek-chat
AI_SUMMARIZE_MODEL=deepseek-chat
```

#### Together.ai

```env
OPENAI_API_KEY=your-together-key
OPENAI_BASE_URL=https://api.together.xyz/v1
AI_FILTER_MODEL=meta-llama/Llama-3-8b-chat-hf
AI_SUMMARIZE_MODEL=meta-llama/Llama-3-70b-chat-hf
```

---

## 🛠 技术栈

### 前端框架

- **Next.js 14**: React框架，使用App Router
- **React 18**: UI库
- **TypeScript**: 类型安全

### 样式

- **Tailwind CSS**: 实用优先的CSS框架
- **next-themes**: 主题切换（暗黑模式）
- **@tailwindcss/typography**: 文章排版

### 内容处理

- **gray-matter**: Frontmatter解析
- **remark-gfm**: GitHub风格Markdown
- **rehype-highlight**: 代码高亮
- **rehype-slug**: 标题ID生成
- **rehype-autolink-headings**: 标题锚点

### AI集成

- **OpenAI SDK**: GPT-4o API调用
- **xml2js**: arXiv XML解析

### 内容管理

- **Decap CMS**: Git-based CMS
- **Netlify Identity**: OAuth认证服务

### 部署

- **GitHub Pages**: 静态托管
- **GitHub Actions**: CI/CD自动化

---

## 📊 GitHub Actions工作流

### 主站部署 (deploy.yml)

- **触发条件**：推送到main分支
- **步骤**：
  1. 安装依赖
  2. 构建静态站点
  3. 部署到GitHub Pages

### 论文自动获取 (fetch-papers.yml)

- **触发条件**：每天UTC 2:00（北京时间10:00）+ 手动触发
- **步骤**：
  1. 从arXiv获取最新论文
  2. AI筛选相关论文
  3. AI生成中英文总结
  4. 创建Markdown文件
  5. 提交PR等待审核

---

## 🔒 权限配置

### GitHub Pages部署

仓库设置中需要：

1. **Settings → Pages → Build and deployment**
   - Source: GitHub Actions

2. **Settings → Actions → General → Workflow permissions**
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

### CMS访问权限

通过Netlify Identity管理：

1. 在Netlify控制台邀请用户
2. 用户收到邮件，设置密码
3. 使用GitHub账号登录CMS

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提Issue和Pull Request！

### 开发流程

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交Pull Request

---

## 📮 联系方式

- **Email**: 2770998795@qq.com
- **GitHub**: [@qiankemeng](https://github.com/qiankemeng)
- **Website**: [https://qiankemeng.github.io](https://qiankemeng.github.io)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Decap CMS](https://decapcms.org/) - 内容管理系统
- [OpenAI](https://openai.com/) - AI模型
- [arXiv](https://arxiv.org/) - 论文来源

---

**注意**：使用前请阅读 [CMS_SETUP.md](./CMS_SETUP.md) 和 [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) 完成配置。
