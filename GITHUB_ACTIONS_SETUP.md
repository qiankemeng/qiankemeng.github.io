# GitHub Actions 配置指南

本文档说明如何在GitHub上配置AI Agent自动运行。

## 📋 目录

1. [必需配置](#必需配置)
2. [可选配置](#可选配置)
3. [配置步骤](#配置步骤)
4. [验证配置](#验证配置)
5. [使用不同API提供商](#使用不同api提供商)
6. [故障排除](#故障排除)

---

## 必需配置

### OPENAI_API_KEY (必需)

这是唯一必需的配置项。

**获取方式**：
1. 访问 https://platform.openai.com/api-keys
2. 登录你的OpenAI账号
3. 点击 "Create new secret key"
4. 复制生成的密钥（以 `sk-` 开头）

---

## 可选配置

以下所有配置都是可选的，如果不设置将使用默认值。

### API配置

| Secret名称 | 说明 | 默认值 | 示例 |
|-----------|------|--------|------|
| `OPENAI_BASE_URL` | API端点 | `https://api.openai.com/v1` | `https://api.deepseek.com` |
| `OPENAI_ORG_ID` | 组织ID | 无 | `org-xxxxx` |

### 模型配置

| Secret名称 | 说明 | 默认值 | 示例 |
|-----------|------|--------|------|
| `AI_FILTER_MODEL` | 筛选模型 | `gpt-4o-mini` | `deepseek-chat` |
| `AI_SUMMARIZE_MODEL` | 总结模型 | `gpt-4o` | `gpt-4o-mini` |

### 筛选配置

| Secret名称 | 说明 | 默认值 | 示例 |
|-----------|------|--------|------|
| `MIN_RELEVANCE_SCORE` | 最低相关度评分 | `6` | `7` (更严格) |
| `MAX_PAPERS_PER_DAY` | 每天最多论文数 | `5` | `3` |

### 输出配置

| Secret名称 | 说明 | 默认值 | 示例 |
|-----------|------|--------|------|
| `GENERATE_ENGLISH` | 生成英文版本 | `true` | `false` |

### 日志配置

| Secret名称 | 说明 | 默认值 | 示例 |
|-----------|------|--------|------|
| `LOG_LEVEL` | 日志级别 | `info` | `debug` |
| `VERBOSE` | 详细输出 | `false` | `true` |

---

## 配置步骤

### 步骤1: 访问仓库设置

1. 打开你的GitHub仓库
2. 点击 **Settings** (设置)

![Settings](https://docs.github.com/assets/cb-27528/images/help/repository/repo-actions-settings.png)

### 步骤2: 进入Secrets页面

1. 在左侧菜单找到 **Secrets and variables**
2. 点击 **Actions**

### 步骤3: 添加Secrets

#### 添加必需的OPENAI_API_KEY

1. 点击 **New repository secret** 按钮
2. 填写信息：
   - **Name**: `OPENAI_API_KEY`
   - **Secret**: 粘贴你的OpenAI API密钥 (以`sk-`开头)
3. 点击 **Add secret**

✅ 完成！这是运行AI Agent所需的唯一必需配置。

#### 添加可选配置 (根据需要)

重复上述步骤，添加你需要的可选Secret：

**示例1：使用DeepSeek（更便宜）**
```
Name: OPENAI_BASE_URL
Secret: https://api.deepseek.com

Name: AI_FILTER_MODEL
Secret: deepseek-chat

Name: AI_SUMMARIZE_MODEL
Secret: deepseek-chat
```

**示例2：降低成本**
```
Name: AI_FILTER_MODEL
Secret: gpt-4o-mini

Name: AI_SUMMARIZE_MODEL
Secret: gpt-4o-mini

Name: MAX_PAPERS_PER_DAY
Secret: 3
```

**示例3：更严格筛选**
```
Name: MIN_RELEVANCE_SCORE
Secret: 7

Name: MAX_PAPERS_PER_DAY
Secret: 3
```

### 步骤4: 保存配置

添加完所有需要的Secrets后，配置就完成了！

---

## 验证配置

### 方法1: 手动触发workflow

1. 访问仓库的 **Actions** 标签页
2. 在左侧选择 **Auto Fetch and Summarize Papers** workflow
3. 点击右上角的 **Run workflow** 下拉按钮
4. 选择分支（通常是 `main`）
5. 点击绿色的 **Run workflow** 按钮

### 方法2: 查看workflow运行日志

1. 在 **Actions** 标签页，点击最近的workflow运行
2. 查看各个步骤的日志输出
3. 特别关注 "Fetch and process papers" 步骤
4. 查看是否有配置验证错误

### 预期输出示例

```
🚀 AI Agent 启动...

============================================================
📋 当前配置
============================================================

🔑 API配置:
   - Base URL: https://api.openai.com/v1
   - API Key: ***已配置***
   - Timeout: 60000ms

🤖 模型配置:
   - 筛选模型: gpt-4o-mini
   - 总结模型: gpt-4o

📊 筛选配置:
   - 最低评分: 6/10
   - 关键词数: 24
   - 排除词数: 12

📁 输出配置:
   - 输出目录: src/content/blog/posts/daily-papers
   - 每日最多: 5 篇
   - 双语版本: 是

============================================================

📅 运行时间: 2024-12-23 04:00:00
🎯 目标: 自动筛选和总结视频理解相关论文
============================================================
```

---

## 使用不同API提供商

### OpenAI (默认)

只需配置API密钥：
```
OPENAI_API_KEY: sk-xxxxx
```

**成本**: ~$0.16/次运行, ~$10/月

---

### DeepSeek (推荐 - 便宜)

```
OPENAI_API_KEY: your-deepseek-api-key
OPENAI_BASE_URL: https://api.deepseek.com
AI_FILTER_MODEL: deepseek-chat
AI_SUMMARIZE_MODEL: deepseek-chat
```

**获取密钥**: https://platform.deepseek.com/api_keys

**成本**: ~$0.02/次运行, ~$1/月 (便宜10倍!)

---

### Together.ai

```
OPENAI_API_KEY: your-together-api-key
OPENAI_BASE_URL: https://api.together.xyz/v1
AI_FILTER_MODEL: meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo
AI_SUMMARIZE_MODEL: meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo
```

**获取密钥**: https://api.together.xyz/settings/api-keys

**成本**: ~$0.05/次运行, ~$3/月

---

### Azure OpenAI (企业用户)

```
OPENAI_API_KEY: your-azure-api-key
OPENAI_BASE_URL: https://your-resource.openai.azure.com/openai/deployments/your-deployment
AI_FILTER_MODEL: gpt-4o-mini
AI_SUMMARIZE_MODEL: gpt-4o
```

**注意**: Azure OpenAI的baseURL格式不同，需要包含deployment信息。

---

## 故障排除

### 问题1: Workflow失败 - "缺少 OPENAI_API_KEY 环境变量"

**原因**: 没有配置API密钥

**解决**:
1. 检查是否添加了 `OPENAI_API_KEY` Secret
2. 确认Secret名称拼写正确（区分大小写）
3. 确认API密钥有效且有足够余额

### 问题2: Workflow运行但没有创建PR

**原因**: 没有找到符合条件的论文

**可能的原因**:
- arXiv当天没有相关论文更新
- 筛选标准太严格

**解决**:
1. 查看workflow日志，确认扫描了多少论文
2. 考虑降低 `MIN_RELEVANCE_SCORE` (例如从6改为5)
3. 增加 `MAX_PAPERS_PER_DAY`

### 问题3: API调用失败

**错误示例**: `Error: 401 Unauthorized`

**解决**:
1. 检查API密钥是否正确
2. 检查API密钥是否过期
3. 如果使用自定义base_url，确认URL正确

### 问题4: 成本过高

**解决方案**:

**方案1: 使用更便宜的模型**
```
AI_FILTER_MODEL: gpt-4o-mini
AI_SUMMARIZE_MODEL: gpt-4o-mini
```
成本降低约50%

**方案2: 切换到DeepSeek**
```
OPENAI_BASE_URL: https://api.deepseek.com
OPENAI_API_KEY: your-deepseek-key
AI_FILTER_MODEL: deepseek-chat
AI_SUMMARIZE_MODEL: deepseek-chat
```
成本降低约90%

**方案3: 减少论文数量**
```
MAX_PAPERS_PER_DAY: 3
MIN_RELEVANCE_SCORE: 7
```

**方案4: 降低运行频率**

编辑 `.github/workflows/fetch-papers.yml`:
```yaml
schedule:
  # 只在凌晨4点运行（删除下午4点）
  - cron: '0 20 * * *'
```

### 问题5: 查看详细日志

如果需要更多调试信息，添加这些Secrets：
```
LOG_LEVEL: debug
VERBOSE: true
```

然后重新运行workflow查看详细日志。

---

## 自动运行时间

AI Agent会在以下时间自动运行：

- **凌晨4点** (UTC 20:00 / 北京时间 04:00)
- **下午4点** (UTC 08:00 / 北京时间 16:00)

每次运行会：
1. 获取arXiv最新论文
2. AI筛选相关论文
3. AI生成详细总结
4. 创建Pull Request
5. 等待人工审核

---

## 监控和维护

### 查看运行历史

1. 访问仓库的 **Actions** 标签页
2. 查看所有workflow运行记录
3. 绿色✅表示成功，红色❌表示失败

### 审核Pull Request

每次Agent运行后会创建PR：

1. 访问仓库的 **Pull requests** 标签页
2. 查看AI生成的论文
3. 检查质量和准确性
4. 如果满意，点击 **Merge pull request**
5. 论文会自动发布到博客

### 调整配置

随时可以在 **Settings** → **Secrets and variables** → **Actions** 中：
- 添加新的Secret
- 修改现有Secret的值
- 删除不需要的Secret

修改后下次运行会自动使用新配置。

---

## 快速开始检查清单

- [ ] 在GitHub仓库添加 `OPENAI_API_KEY` Secret
- [ ] (可选) 配置其他Secrets（模型、筛选标准等）
- [ ] 手动触发一次workflow测试
- [ ] 查看workflow日志确认配置正确
- [ ] 等待自动运行或查看创建的PR
- [ ] 审核并合并PR

---

## 相关文档

- [AI_AGENT_USAGE.md](AI_AGENT_USAGE.md) - AI Agent使用指南
- [scripts/agent/README.md](scripts/agent/README.md) - Agent技术文档
- [.env.example](.env.example) - 环境变量示例

---

**更新日期**: 2024-12-23
**维护者**: @qiankemeng
**问题反馈**: GitHub Issues
