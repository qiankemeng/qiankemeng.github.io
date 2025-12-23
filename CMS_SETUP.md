# 博客管理后台设置指南

## 📖 概述

本项目使用 **Decap CMS**（原 Netlify CMS）作为博客内容管理系统，提供可视化的在线编辑界面。

### 特性

- ✅ **完全静态**：无需后端服务器，直接部署在GitHub Pages
- ✅ **Git工作流**：所有更改通过Git提交，保留完整历史
- ✅ **可视化编辑**：Markdown编辑器+实时预览
- ✅ **双语支持**：中文/英文内容独立管理
- ✅ **分类管理**：5大博客分类（每日论文、研究、教程、笔记、杂项）
- ✅ **工作流管理**：草稿 → 审核 → 发布流程
- ✅ **图片上传**：支持直接上传图片到仓库

---

## 🚀 快速开始

### 1️⃣ 创建Netlify账号（用于OAuth认证）

Decap CMS需要OAuth服务来进行GitHub认证。最简单的方式是使用Netlify提供的免费OAuth服务。

1. 访问 [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. 使用GitHub账号登录
3. 导入你的GitHub仓库 `qiankemeng/qiankemeng.github.io`
4. 构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. 点击 "Deploy site"

### 2️⃣ 在Netlify中启用Git Gateway

Git Gateway是Netlify提供的服务，允许CMS通过API访问GitHub仓库。

1. 在Netlify控制台，进入你的站点
2. 点击 **Settings** → **Identity**
3. 点击 **Enable Identity**
4. 向下滚动到 **Services** → **Git Gateway**
5. 点击 **Enable Git Gateway**

### 3️⃣ 配置GitHub OAuth（可选，推荐）

如果你想使用自己的OAuth App而不是Netlify的服务：

#### 创建GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写信息：
   - **Application name**: `Qiankemeng Blog CMS`
   - **Homepage URL**: `https://qiankemeng.github.io`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. 点击 **Register application**
5. 记录 **Client ID** 和 **Client Secret**

#### 在Netlify中配置OAuth

1. 在Netlify控制台，进入 **Settings** → **Identity** → **External providers**
2. 点击 **Add provider**，选择 **GitHub**
3. 填入刚才记录的 **Client ID** 和 **Client Secret**
4. 保存设置

### 4️⃣ 邀请自己为管理员

1. 在Netlify控制台，进入 **Identity** 标签
2. 点击 **Invite users**
3. 输入你的邮箱
4. 查收邮件，点击邀请链接
5. 设置密码并确认

### 5️⃣ 更新CMS配置

修改 `public/admin/config.yml` 中的仓库信息：

```yaml
backend:
  name: github
  repo: qiankemeng/qiankemeng.github.io  # 改为你的GitHub用户名/仓库名
  branch: main
```

---

## 💻 使用方法

### 访问管理后台

部署后，访问以下URL进入CMS管理界面：

```
https://qiankemeng.github.io/admin/
```

或本地开发时：

```
http://localhost:3000/admin/
```

### 登录

1. 点击 **Login with GitHub**
2. 授权GitHub访问
3. 进入管理界面

### 创建新文章

1. 在左侧菜单选择分类（如"每日论文 (中文)"）
2. 点击 **New 论文**
3. 填写字段：
   - **标题**：文章标题
   - **发布日期**：选择日期
   - **摘要**：简短描述
   - **标签**：添加标签（用于分类）
   - **内容**：Markdown格式的正文
4. 点击 **Save** 保存草稿
5. 准备发布时，将状态改为 **Ready**
6. 点击 **Publish** → **Publish now**

### 编辑现有文章

1. 在集合中找到文章
2. 点击进入编辑
3. 修改内容
4. 保存并发布

### 上传图片

1. 在Markdown编辑器中，点击图片图标
2. 选择本地图片上传
3. 图片会自动上传到 `public/images/blog/` 目录
4. 编辑器自动插入图片链接

### 工作流程

Decap CMS使用编辑工作流，确保内容质量：

1. **草稿（Draft）**：新创建的文章
   - 保存在单独的分支
   - 可以随时编辑
   - 不会出现在网站上

2. **审核中（In Review）**：准备发布
   - 标记为"Ready"
   - 创建Pull Request
   - 可以预览更改

3. **已发布（Published）**：正式发布
   - 合并PR到main分支
   - 触发GitHub Actions自动部署
   - 文章出现在网站上

### Markdown语法支持

CMS的编辑器支持完整的Markdown语法：

```markdown
# 一级标题
## 二级标题

**粗体** *斜体*

- 列表项1
- 列表项2

[链接文本](https://example.com)

![图片描述](/images/blog/image.jpg)

\`\`\`python
# 代码块
def hello():
    print("Hello, World!")
\`\`\`
```

---

## 🔧 配置说明

### 博客分类结构

| 分类 | 中文名称 | 英文名称 | 用途 |
|------|---------|---------|------|
| daily-papers | 每日论文 | Daily Papers | AI Agent自动推送的论文总结 |
| research | 我的研究 | Research | 个人研究成果和论文解读 |
| tutorials | 技术教程 | Tutorials | 技术教程和实践指南 |
| notes | 学习笔记 | Notes | 学习笔记和心得 |
| others | 杂项 | Others | 其他类型文章 |

### 文章元数据字段

#### 每日论文 (daily-papers)

```yaml
title: 论文标题
date: 2025-12-23
summary: 简短摘要
arxivId: "2404.12345"
authors:
  - Author 1
  - Author 2
categories:
  - cs.CV
  - cs.AI
arxivUrl: https://arxiv.org/abs/2404.12345
pdfUrl: https://arxiv.org/pdf/2404.12345.pdf
tags:
  - 视频理解
  - 多模态
filterScore: 9
filterReason: 核心创新点
```

#### 其他分类 (research/tutorials/notes/others)

```yaml
title: 文章标题
date: 2025-12-23
summary: 简短摘要
tags:
  - 标签1
  - 标签2
cover: /images/blog/cover.jpg  # 可选
difficulty: 中级  # 仅tutorials
```

### 自定义CMS配置

所有CMS配置在 `public/admin/config.yml` 中：

```yaml
# 后端设置
backend:
  name: github
  repo: your-username/your-repo
  branch: main

# 媒体文件设置
media_folder: "public/images/blog"
public_folder: "/images/blog"

# 发布模式
publish_mode: editorial_workflow  # 启用草稿工作流
```

---

## 🛠 本地开发

### 启用本地后端

对于本地开发，可以启用本地后端模式，无需GitHub OAuth：

1. 安装本地代理：

```bash
npx decap-server
```

2. 修改 `public/admin/config.yml`：

```yaml
# 取消注释以下行
local_backend: true
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 访问 `http://localhost:3000/admin/`

本地模式下，所有更改直接保存到本地文件系统，无需GitHub认证。

---

## 🚨 故障排查

### 问题1: 无法登录

**症状**：点击"Login with GitHub"后无响应或报错

**解决方案**：
1. 确认已在Netlify中启用Identity和Git Gateway
2. 检查GitHub OAuth App配置
3. 确认回调URL正确：`https://api.netlify.com/auth/done`
4. 清除浏览器缓存，重试

### 问题2: 无法提交更改

**症状**：保存文章后GitHub上看不到更改

**解决方案**：
1. 检查GitHub仓库的 **Pull Requests** 标签
2. 文章会先创建为PR，需要手动合并或在CMS中点击"Publish"
3. 确认你有仓库的写入权限

### 问题3: 图片上传失败

**症状**：上传图片时报错

**解决方案**：
1. 确认 `public/images/blog/` 目录存在
2. 检查图片大小（建议<5MB）
3. 使用支持的格式：jpg, png, gif, svg, webp

### 问题4: CMS页面空白

**症状**：访问 `/admin/` 显示空白页

**解决方案**：
1. 检查浏览器控制台（F12）查看错误
2. 确认 `public/admin/config.yml` 和 `public/admin/index.html` 存在
3. 验证config.yml的YAML语法是否正确
4. 确认CDN资源可访问（检查网络连接）

### 问题5: "Config Error"

**症状**：CMS显示配置错误

**解决方案**：
1. 使用YAML验证器检查 `config.yml` 语法
2. 常见错误：
   - 缩进不正确（必须使用空格，不能用Tab）
   - 引号未闭合
   - 列表格式错误
3. 参考 [Decap CMS文档](https://decapcms.org/docs/configuration-options/)

---

## 📚 进阶配置

### 自定义编辑器组件

你可以在 `public/admin/index.html` 中注册自定义组件：

```html
<script>
  CMS.registerEditorComponent({
    id: "youtube",
    label: "YouTube",
    fields: [{name: 'id', label: 'YouTube Video ID'}],
    pattern: /^{{<\s*youtube\s+(\S+)\s*>}}/,
    fromBlock: function(match) {
      return {id: match[1]};
    },
    toBlock: function(obj) {
      return '{{< youtube ' + obj.id + ' >}}';
    },
    toPreview: function(obj) {
      return (
        '<img src="http://img.youtube.com/vi/' + obj.id + '/maxresdefault.jpg" alt="Youtube Video"/>'
      );
    }
  });
</script>
```

### 批量导入现有文章

如果你有现有的Markdown文件，只需：

1. 确保文件符合frontmatter格式
2. 放入对应的 `src/content/blog/posts/{category}/` 目录
3. 文件名格式：`{slug}.{locale}.md`（如 `my-post.zh.md`）
4. 提交到GitHub
5. 文章会自动出现在CMS中

### 备份策略

由于所有内容都在Git中，备份非常简单：

1. **自动备份**：每次提交都是一个备份点
2. **手动备份**：定期 `git clone` 仓库到本地
3. **GitHub自动备份**：GitHub本身就提供可靠的存储

---

## 🔗 相关资源

- [Decap CMS官方文档](https://decapcms.org/docs/intro/)
- [Netlify Identity文档](https://docs.netlify.com/visitor-access/identity/)
- [GitHub OAuth文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Markdown语法指南](https://www.markdownguide.org/basic-syntax/)

---

## ❓ 常见问题

**Q: CMS是否支持多人协作？**

A: 是的！通过Netlify Identity可以邀请多个用户。每个用户都需要在Netlify控制台中被邀请。

**Q: 可以自定义CMS界面吗？**

A: 可以通过CSS自定义样式。在 `public/admin/index.html` 中添加 `<style>` 标签。

**Q: CMS是否会影响网站性能？**

A: 不会。CMS仅在 `/admin/` 路径下加载，不影响主站性能。

**Q: 如何回滚到之前的版本？**

A: 通过Git历史记录可以轻松回滚。在GitHub上找到对应的commit，revert即可。

**Q: 是否支持自动保存？**

A: 支持。CMS会自动保存草稿到浏览器localStorage，刷新页面不会丢失内容。

**Q: 可以在手机上使用吗？**

A: CMS界面对移动端有基本支持，但推荐使用桌面浏览器以获得最佳体验。

---

## 🎉 开始使用

按照本指南完成设置后，你就可以：

✅ 在任何地方通过浏览器管理博客
✅ 可视化编辑Markdown内容
✅ 上传和管理图片
✅ 使用工作流管理文章发布
✅ 保留完整的版本历史

祝使用愉快！如有问题，欢迎查阅 [Decap CMS官方文档](https://decapcms.org/docs/intro/) 或提Issue。
