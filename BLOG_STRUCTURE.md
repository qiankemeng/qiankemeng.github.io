# 博客分类体系说明

## 📚 分类概览

本博客采用5个主要分类，清晰区分不同类型的内容：

```
src/content/blog/posts/
├── research/         我的研究论文
├── daily-papers/     AI精选论文（自动推送）
├── tutorials/        技术教程
├── notes/            学习笔记
└── others/           杂项
```

---

## 1. research - 我的研究论文

**用途**：存放你自己发表或参与的研究成果

**特点**：
- 包含完整的论文元数据（venue, status, authors等）
- 支持PDF、arXiv、GitHub等链接
- 通常是正式发表或投稿中的工作

**创建方式**：
```bash
npm run create-post
# 选择分类: 1 (我的研究)
```

**示例内容**：
- VideoARM论文详解
- 本科毕业论文总结
- 会议论文分享

---

## 2. daily-papers - AI精选论文 ⭐

**用途**：AI Agent自动筛选和推送的优质论文

**特点**：
- **完全自动化**：由AI Agent每日筛选arXiv最新论文
- **聚焦领域**：视频问答、MLLM、Agent
- **AI生成摘要**：包含核心创新、方法概述、个人点评
- **标注来源**：明确标识为AI自动生成

**自动化流程**：
```
arXiv最新论文 → AI筛选 → AI总结 → 创建PR → 人工审核 → 发布
```

**访问方式**：
- 博客分类筛选：选择"AI精选"
- URL：`/blog?category=daily-papers`

**⚠️ 注意**：
- 手动创建文章时**不要**选择此分类
- 此分类仅供AI Agent使用
- 如需手动添加论文解读，请使用`research`或`notes`分类

---

## 3. tutorials - 技术教程

**用途**：系统性的技术学习内容和教程

**特点**：
- 结构化的技术教学内容
- Step-by-step指导
- 可包含代码示例、实践项目

**创建方式**：
```bash
npm run create-post
# 选择分类: 3 (技术教程)
```

**示例内容**：
- Next.js全栈开发教程
- 多模态模型微调指南
- PyTorch实战系列

---

## 4. notes - 学习笔记

**用途**：日常学习和思考记录

**特点**：
- 非正式的学习总结
- 读书笔记、课程笔记
- 技术见解和思考

**创建方式**：
```bash
npm run create-post
# 选择分类: 4 (学习笔记)
```

**示例内容**：
- Transformer原理学习笔记
- CLIP论文阅读心得
- 深度学习课程笔记

---

## 5. others - 杂项

**用途**：不适合其他分类的内容

**特点**：
- 灵活的内容类型
- 可以是技术之外的思考
- 临时性或实验性内容

**创建方式**：
```bash
npm run create-post
# 选择分类: 5 (杂项)
```

**示例内容**：
- 博客系统搭建记录
- 科研工具推荐
- 个人思考和感悟

---

## 📊 分类对比

| 分类 | 正式程度 | 内容来源 | 论文字段 | 典型标签 |
|------|---------|---------|---------|---------|
| **research** | 高 | 自己的研究 | ✅ 完整 | 视频理解, CVPR |
| **daily-papers** | 中 | AI自动推送 | ✅ 完整 | MLLM, Agent, arXiv |
| **tutorials** | 中 | 原创教程 | ❌ | PyTorch, 教程 |
| **notes** | 低 | 学习笔记 | ❌ | 学习笔记, 思考 |
| **others** | 低 | 其他内容 | ❌ | 工具, 杂谈 |

---

## 🎯 内容定位建议

### 何时使用 research？
- ✅ 你是论文作者之一
- ✅ 论文已发表或投稿中
- ✅ 需要详细元数据（venue, authors等）

### 何时使用 daily-papers？
- ❌ **从不手动使用**
- ✅ 仅由AI Agent自动创建
- ✅ 每日自动推送最新论文

### 何时使用 tutorials？
- ✅ 系统性的技术教学
- ✅ 包含完整的实践步骤
- ✅ 可复现的代码示例

### 何时使用 notes？
- ✅ 快速记录学习心得
- ✅ 非正式的技术分享
- ✅ 论文阅读笔记

### 何时使用 others？
- ✅ 不确定放哪个分类时
- ✅ 跨领域的内容
- ✅ 实验性内容

---

## 🤖 AI Agent配置

AI Agent专门为`daily-papers`分类服务：

**筛选标准**：
- 关键词：视频问答、MLLM、Agent、长视频理解
- 会议：CVPR、ICCV、NeurIPS、ICML等顶会
- 来源：arXiv最新预印本

**推送频率**：
- 每天自动运行（UTC 00:00 / 北京时间 08:00）
- 每次筛选~50篇，推送~3篇精选

**工作流程**：
1. 从arXiv获取最新论文
2. AI筛选符合标准的论文
3. AI生成中文摘要和点评
4. 自动创建到`daily-papers/`目录
5. 创建PR等待人工审核
6. 审核通过后自动部署

**查看AI Agent配置**：
- 详细文档：`AI_AGENT_DESIGN.md`
- 工作流配置：`.github/workflows/fetch-papers.yml`

---

## 📝 内容创建流程

### 手动创建文章

1. **使用交互式脚本**（推荐）：
   ```bash
   npm run create-post
   ```

2. **手动创建文件**：
   - 在对应分类目录创建`.zh.md`和`.en.md`文件
   - 文件名格式：`{slug}.{locale}.md`
   - 包含完整的frontmatter

### AI自动创建（daily-papers）

1. **手动触发测试**：
   ```bash
   npm run import-paper 2404.12345  # arXiv ID
   ```

2. **自动化运行**：
   - GitHub Actions每天自动运行
   - 查看运行状态：GitHub仓库 → Actions标签

---

## 🔍 内容筛选

### 前端筛选功能

访问 `/blog` 页面，使用侧边栏筛选：

- **分类筛选**：点击分类按钮快速过滤
- **标签筛选**：点击标签查看相关文章
- **年份筛选**：按发表年份查看
- **会议筛选**：针对论文类别的会议过滤（research、daily-papers）

### URL参数

直接通过URL访问特定分类：

```
/blog?category=research         # 我的研究
/blog?category=daily-papers     # AI精选
/blog?category=tutorials        # 技术教程
/blog?category=notes           # 学习笔记
/blog?category=others          # 杂项

# 组合筛选
/blog?category=daily-papers&tag=MLLM&year=2024
```

---

## 🎨 分类标识

在前端，每个分类都有独特的视觉标识：

- **我的研究**：蓝色标签，显示venue和status
- **AI精选**：紫色标签，标注"AI生成"
- **技术教程**：绿色标签
- **学习笔记**：黄色标签
- **杂项**：灰色标签

---

## 📈 未来扩展

当内容增长时，可以考虑：

### 短期（内容 < 50篇）
- ✅ 当前分类体系足够
- ✅ 用标签细分领域

### 中期（内容 50-100篇）
- 考虑在`daily-papers/`下按领域细分：
  - `daily-papers/computer-vision/`
  - `daily-papers/nlp/`
  - `daily-papers/multimodal/`
- 添加全文搜索功能

### 长期（内容 > 100篇）
- 引入更细粒度的分类
- 实现系列文章功能
- 添加专题和合集

---

## ⚠️ 注意事项

1. **不要混淆分类**
   - `research`：你自己的论文
   - `daily-papers`：AI推送的其他论文

2. **daily-papers仅供AI使用**
   - 不要手动创建文章到此目录
   - 如需手动添加论文解读，使用`notes`

3. **保持一致性**
   - 中英文文件同步更新
   - frontmatter字段完整

4. **标签规范**
   - 使用小写和连字符：`video-understanding`
   - 中文标签也可以：`视频理解`
   - 保持标签一致性，避免重复

---

## 🚀 快速开始

```bash
# 创建我的研究论文
npm run create-post
# 选择: 1 (我的研究)

# 创建学习笔记
npm run create-post
# 选择: 4 (学习笔记)

# 测试AI论文导入
npm run import-paper 2404.12345

# 构建和预览
npm run build
npm run dev
```

---

**更新日期**：2024-12-23
**版本**：v2.0 - 扩展分类体系

完整的技术文档请查看：
- 重构说明：`REFACTORING.md`
- AI Agent设计：`AI_AGENT_DESIGN.md`
- 项目文档：`CLAUDE.md`
