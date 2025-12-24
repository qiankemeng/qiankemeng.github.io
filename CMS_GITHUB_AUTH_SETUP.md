# CMS GitHub 认证设置指南

## 📌 背景

Netlify Identity 服务已经停止，我们需要使用其他方式进行 CMS 认证。

对于纯静态站点（GitHub Pages），有以下几种方案：

---

## 🎯 推荐方案对比

| 方案 | 难度 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| **方案A：本地开发模式** | ⭐ 简单 | 免费、无需配置、立即可用 | 只能本地使用 | 个人开发 |
| **方案B：使用 Vercel** | ⭐⭐ 中等 | 功能完整、稳定 | 需要额外账号 | 生产环境 |
| **方案C：GitHub OAuth 代理** | ⭐⭐⭐ 复杂 | 完全自主控制 | 需要部署服务 | 高级用户 |

---

## ✅ 方案 A：本地开发模式（推荐新手）

这是**最简单**的方案，适合个人使用。

### 特点
- ✅ 完全免费
- ✅ 无需任何第三方服务
- ✅ 5分钟即可开始使用
- ✅ 直接编辑本地文件，立即提交到 GitHub
- ⚠️ 只能在本地电脑使用（无法远程访问）

### 设置步骤

#### 1. 更新 CMS 配置

编辑 `public/admin/config.yml`：

```yaml
backend:
  name: git-gateway
  branch: main

# 启用本地后端
local_backend: true
```

#### 2. 启动本地服务

打开**两个**终端窗口：

**终端 1 - CMS 后端服务：**
```bash
npx decap-server
```
应该看到：`Decap Server listening on port 8081`

**终端 2 - 开发服务器：**
```bash
npm run dev
```
应该看到：`Local: http://localhost:3000`

#### 3. 访问 CMS

打开浏览器访问：
```
http://localhost:3000/admin/
```

🎉 **完成！** 您现在可以直接使用 CMS，所有更改会保存到本地文件。

#### 4. 提交更改到 GitHub

编辑完成后，在终端运行：
```bash
git add .
git commit -m "Update blog posts"
git push origin main
```

### 优点
- 无需任何 OAuth 配置
- 数据直接保存到本地文件
- 完全掌控您的内容
- 适合日常写作和管理

### 缺点
- 无法在其他设备访问（如手机、其他电脑）
- 需要在本地运行两个服务
- 不适合团队协作

---

## 🚀 方案 B：使用 Vercel（推荐生产环境）

Vercel 提供免费的 OAuth 服务，可以替代 Netlify Identity。

### 特点
- ✅ 完全免费（个人用户）
- ✅ 可以在任何地方访问
- ✅ 支持团队协作
- ✅ 配置相对简单
- ⚠️ 需要 Vercel 账号

### 设置步骤

#### 1. 创建 Vercel 账号

1. 访问 https://vercel.com/signup
2. 使用 GitHub 账号登录
3. 授权 Vercel 访问您的仓库

#### 2. 导入项目

1. 在 Vercel 控制台，点击 **"Add New..."** → **"Project"**
2. 选择 `qiankemeng/qiankemeng.github.io` 仓库
3. 构建设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
4. 点击 **"Deploy"**

#### 3. 安装 OAuth 应用

1. 在 Vercel 项目页面，点击 **"Settings"**
2. 找到 **"Integrations"**
3. 搜索 **"Decap CMS"** 或 **"Netlify CMS"**
4. 点击 **"Add Integration"**
5. 授权并配置

#### 4. 获取 OAuth 端点

集成成功后，Vercel 会提供 OAuth 端点 URL，类似：
```
https://your-project.vercel.app/api/auth
```

#### 5. 更新 CMS 配置

编辑 `public/admin/config.yml`：

```yaml
backend:
  name: github
  repo: qiankemeng/qiankemeng.github.io
  branch: main
  base_url: https://your-project.vercel.app  # 改为您的 Vercel 项目 URL
  auth_endpoint: api/auth
```

#### 6. 部署

```bash
git add public/admin/config.yml
git commit -m "Configure Vercel OAuth"
git push origin main
```

等待 GitHub Actions 部署完成。

#### 7. 测试

访问 `https://qiankemeng.github.io/admin/`，应该看到 GitHub 登录按钮。

### 优点
- 可以在任何地方访问 CMS
- 支持多人协作
- Vercel 免费额度足够个人使用
- 配置后无需维护

### 缺点
- 需要 Vercel 账号
- 内容会同时部署到 Vercel 和 GitHub Pages（双重部署）

---

## ⚡ 方案 C：自建 OAuth 代理服务（高级）

如果您想要完全自主控制，可以部署自己的 OAuth 代理。

### 使用 Cloudflare Workers

#### 1. 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 **"New OAuth App"**
3. 填写信息：
   - **Application name**: `Qiankemeng Blog CMS`
   - **Homepage URL**: `https://qiankemeng.github.io`
   - **Authorization callback URL**: `https://your-worker.workers.dev/callback`
4. 记录 **Client ID** 和 **Client Secret**

#### 2. 部署 OAuth 代理

使用开源项目：https://github.com/vencax/netlify-cms-github-oauth-provider

```bash
# 克隆仓库
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider

# 安装依赖
npm install

# 配置环境变量
export OAUTH_CLIENT_ID=your_client_id
export OAUTH_CLIENT_SECRET=your_client_secret

# 部署到 Cloudflare Workers 或其他平台
```

#### 3. 更新 CMS 配置

```yaml
backend:
  name: github
  repo: qiankemeng/qiankemeng.github.io
  branch: main
  base_url: https://your-oauth-proxy.workers.dev
  auth_endpoint: /auth
```

### 优点
- 完全自主控制
- 无需依赖第三方平台
- 可以自定义功能

### 缺点
- 配置复杂
- 需要维护服务器
- 需要处理安全问题

---

## 🎯 我该选择哪个方案？

### 个人博客，只在家里写作
→ **方案 A（本地开发模式）** ⭐ 推荐

### 想在任何地方访问，不想折腾
→ **方案 B（Vercel）** ⭐⭐ 推荐

### 技术达人，想要完全掌控
→ **方案 C（自建服务）** ⭐⭐⭐

---

## 📝 快速开始：本地开发模式

既然您已经配置到这里，我建议先使用**方案 A（本地开发模式）**，这是最快最简单的方式：

### 一键设置

我已经为您准备好了配置切换脚本：

```bash
# 切换到本地开发模式
./scripts/cms-test-mode.sh
# 选择选项 3：切换到本地开发模式
```

或者手动修改 `public/admin/config.yml`：

```yaml
backend:
  name: git-gateway
  branch: main

local_backend: true  # 添加这一行
```

然后：

```bash
# 终端 1
npx decap-server

# 终端 2（新终端）
npm run dev

# 访问
http://localhost:3000/admin/
```

---

## ❓ 常见问题

**Q: 为什么 Netlify Identity 不能用了？**

A: Netlify 在 2023 年逐步停止了免费的 Identity 服务，现在主要服务于企业客户。

**Q: 本地模式足够用吗？**

A: 对于个人博客完全够用！您可以：
- 创建和编辑文章
- 上传图片
- 预览效果
- 提交到 GitHub

唯一的限制是需要在本地电脑操作。

**Q: 如果我想要远程访问怎么办？**

A: 使用方案 B（Vercel）或方案 C（自建服务）。

**Q: 本地模式会影响已有的配置吗？**

A: 不会。只是添加了 `local_backend: true`，其他配置保持不变。

---

## 🔄 配置文件示例

### 本地开发模式配置

```yaml
backend:
  name: git-gateway
  branch: main

# 启用本地后端
local_backend: true

media_folder: "public/images/blog"
public_folder: "/images/blog"

collections:
  - name: "notes-zh"
    label: "学习笔记"
    folder: "src/content/blog/posts/notes"
    create: true
    slug: "{{slug}}"
    extension: "zh.md"
    fields:
      - {label: "标题", name: "title", widget: "string"}
      - {label: "日期", name: "date", widget: "datetime"}
      - {label: "内容", name: "body", widget: "markdown"}
```

### Vercel OAuth 配置

```yaml
backend:
  name: github
  repo: qiankemeng/qiankemeng.github.io
  branch: main
  base_url: https://your-project.vercel.app
  auth_endpoint: api/auth

media_folder: "public/images/blog"
public_folder: "/images/blog"

# ... collections 配置相同
```

---

## 📚 相关资源

- **Decap CMS 官方文档**: https://decapcms.org/docs/intro/
- **本地开发文档**: https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository
- **GitHub OAuth 文档**: https://docs.github.com/en/developers/apps/building-oauth-apps
- **Vercel 文档**: https://vercel.com/docs

---

## 💡 建议

对于您的使用场景（个人博客），我强烈推荐：

1. **现在立即使用**：方案 A（本地开发模式）
   - 5 分钟即可开始写作
   - 无需任何额外配置

2. **未来升级**：如果需要远程访问，再升级到方案 B（Vercel）
   - 配置也很简单
   - 免费额度足够使用

**不要被复杂的配置吓到！本地模式非常简单，而且完全够用。** 🚀
