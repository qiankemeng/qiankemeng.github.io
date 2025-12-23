# AI Agent 使用指南

本文档说明如何配置和使用AI Agent自动筛选arXiv论文。

## 🚀 快速开始

### 1. 配置OpenAI API密钥

AI Agent需要OpenAI API密钥来运行。有两种方式配置：

#### 方式一：GitHub Secrets（推荐，用于自动化）

1. 访问GitHub仓库设置
2. 进入 `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`
4. 添加Secret:
   - Name: `OPENAI_API_KEY`
   - Value: 你的OpenAI API密钥

#### 方式二：本地环境变量（用于本地测试）

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 2. 本地测试

```bash
# 安装依赖
cd scripts
npm install

# 测试arXiv获取功能
npm run agent:test

# 运行完整流程（需要API密钥）
npm run agent
```

### 3. GitHub Actions自动化

配置完成后，AI Agent会自动：
- ⏰ 每天凌晨4点运行（UTC 20:00 / 北京时间 04:00）
- ⏰ 每天下午4点运行（UTC 08:00 / 北京时间 16:00）
- 🔍 扫描当天arXiv更新的video相关论文
- 🤖 AI自动筛选和总结
- 📝 创建PR供人工审核

#### 手动触发

如果需要立即运行：

1. 访问 GitHub Actions 页面
2. 选择 `Auto Fetch and Summarize Papers` workflow
3. 点击 `Run workflow`
4. 选择分支（通常是`main`）
5. 点击绿色的 `Run workflow` 按钮

## 📊 工作流程

```
┌─────────────────────────────────────────────────────────┐
│  1. 从arXiv获取今日更新的video相关论文                      │
│     - 搜索cs.CV分类 + video关键词                         │
│     - 获取最近24小时内更新的论文                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. AI快速筛选（使用gpt-4o-mini）                          │
│     - 分析标题和摘要                                       │
│     - 评分0-10分                                          │
│     - 保留评分≥6的论文                                     │
│     - 重点关注：视频理解、MLLM、Agent                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. AI详细总结（使用gpt-4o）                               │
│     - 核心创新（2-3段）                                    │
│     - 方法概述（3-4段）                                    │
│     - 实验结果（2-3段）                                    │
│     - 个人点评（1-2段）                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. 生成Markdown文件                                      │
│     - 中文版：{slug}.zh.md                               │
│     - 英文版：{slug}.en.md                               │
│     - 保存到：src/content/blog/posts/daily-papers/      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. 创建Pull Request                                     │
│     - 自动提交到新分支                                     │
│     - 创建PR供审核                                        │
│     - 标签：automated, papers, ai-curated                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  6. 人工审核                                             │
│     - 检查论文质量                                        │
│     - 验证总结准确性                                      │
│     - 合并PR后自动部署                                    │
└─────────────────────────────────────────────────────────┘
```

## ⚙️ 配置说明

所有配置都在 `scripts/agent/config.js` 文件中：

### 关键配置项

#### 1. arXiv搜索

```javascript
arxiv: {
  // 搜索查询（可自定义）
  searchQuery: 'cat:cs.CV+AND+(video+OR+videos+OR+visual+OR+multimodal)',

  // 每次获取的最大论文数
  maxResults: 100,
}
```

**修改建议**：
- 如果想扩大范围，添加更多分类：`cat:cs.CV+OR+cat:cs.AI`
- 如果想缩小范围，添加更具体的关键词

#### 2. AI模型选择

```javascript
ai: {
  // 筛选用小模型（快速、便宜）
  filterModel: 'gpt-4o-mini',

  // 总结用大模型（质量高）
  summarizeModel: 'gpt-4o',

  temperature: 0.3,  // 较低的温度以获得稳定输出
  maxTokens: 4000    // 总结的最大长度
}
```

**成本优化**：
- 可以都用 `gpt-4o-mini` 降低成本（质量略有下降）
- 可以用 `gpt-4o` 做筛选提高精度（成本增加）

#### 3. 筛选标准

```javascript
filter: {
  // 必须包含的关键词（满足任意一个即可）
  includeKeywords: [
    'video understanding',
    'multimodal llm',
    'agent',
    // ... 可添加更多
  ],

  // 排除的关键词
  excludeKeywords: [
    'medical',
    'satellite',
    // ... 可添加更多
  ],

  // 最低相关度评分（0-10）
  minRelevanceScore: 6
}
```

**调整建议**：
- `minRelevanceScore: 7` - 更严格，论文更少但质量更高
- `minRelevanceScore: 5` - 更宽松，获得更多论文

#### 4. 输出控制

```javascript
output: {
  // 输出目录
  directory: 'src/content/blog/posts/daily-papers',

  // 每天最多推送的论文数
  maxPapersPerDay: 5,

  // 是否生成英文版本
  generateEnglishVersion: true
}
```

## 📈 成本估算

基于当前配置（每天2次，每次处理~50篇论文，筛选出3-5篇）：

| 项目 | 模型 | Token估算 | 单价 | 每次成本 |
|-----|------|----------|------|---------|
| 筛选50篇 | gpt-4o-mini | ~50K input | $0.15/1M | $0.0075 |
| 总结5篇 | gpt-4o | ~30K total | $5/1M | $0.15 |
| **单次总计** | | | | **$0.16** |
| **每天2次** | | | | **$0.32** |
| **每月总计** | | | | **~$10** |

**节省成本的方法**：
1. 减少运行频率（每天1次）
2. 减少 `maxPapersPerDay`（每天3篇）
3. 筛选和总结都用 `gpt-4o-mini`（质量略降）

## 🔧 故障排除

### 问题1: GitHub Actions失败

**检查清单**：
- [ ] 是否设置了 `OPENAI_API_KEY` secret
- [ ] API密钥是否有效
- [ ] 是否有足够的OpenAI credit

**解决方法**：
1. 查看Actions日志找到具体错误
2. 检查API密钥配置
3. 测试API连接：
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

### 问题2: 没有找到论文

**可能原因**：
- arXiv当天没有更新相关论文
- 搜索查询太严格
- 筛选标准太严格

**解决方法**：
1. 检查arXiv是否有新论文：https://arxiv.org/list/cs.CV/recent
2. 调整 `searchQuery` 扩大范围
3. 降低 `minRelevanceScore`
4. 手动触发测试

### 问题3: 筛选结果不准确

**解决方法**：
1. 调整 `includeKeywords` 和 `excludeKeywords`
2. 提高 `minRelevanceScore`
3. 在 `scripts/agent/filter.js` 中优化prompt
4. 本地测试筛选效果

### 问题4: 总结质量不够好

**解决方法**：
1. 使用更好的模型（如 `gpt-4o` 而非 `gpt-4o-mini`）
2. 在 `scripts/agent/summarizer.js` 中优化prompt
3. 增加 `maxTokens` 允许更长的总结
4. 调整 `temperature` (降低获得更稳定输出)

## 🔍 监控和维护

### 查看运行日志

1. 访问 GitHub Actions 页面
2. 选择最近的workflow运行
3. 查看详细日志和统计信息

### 审核PR

每次Agent运行后会创建PR：

1. **检查列表**：
   - [ ] 论文是否与研究方向相关
   - [ ] 总结是否准确
   - [ ] 标签分类是否合理
   - [ ] 格式是否正确
   - [ ] 链接是否有效

2. **修改内容**（如需要）：
   - 在PR分支直接编辑Markdown文件
   - 调整总结内容
   - 修改标签
   - 添加个人评论

3. **合并PR**：
   - 审核通过后合并
   - 自动触发GitHub Pages部署
   - 5-10分钟后文章上线

### 定期维护

建议每周检查：

1. **成本监控**：
   - 查看OpenAI usage dashboard
   - 确保在预算范围内

2. **质量评估**：
   - 回顾最近的论文
   - 评估AI总结质量
   - 收集用户反馈

3. **配置优化**：
   - 根据实际效果调整筛选标准
   - 优化关键词列表
   - 更新排除列表

## 📚 相关文档

- [scripts/agent/README.md](scripts/agent/README.md) - Agent技术文档
- [BLOG_STRUCTURE.md](BLOG_STRUCTURE.md) - 博客分类体系
- [AI_AGENT_DESIGN.md](AI_AGENT_DESIGN.md) - Agent设计方案
- [arXiv API](https://info.arxiv.org/help/api/index.html) - arXiv API文档
- [OpenAI API](https://platform.openai.com/docs/api-reference) - OpenAI API文档

## 💡 最佳实践

1. **首次运行**：
   - 先在本地测试
   - 验证配置正确
   - 检查输出质量

2. **调试**：
   - 使用单个模块测试功能
   - 逐步调试问题
   - 查看详细日志

3. **成本控制**：
   - 设置每月预算上限
   - 监控API使用量
   - 定期检查账单

4. **质量保证**：
   - 务必人工审核
   - 对比原论文验证准确性
   - 收集反馈持续优化

---

**更新日期**: 2024-12-23
**维护者**: @qiankemeng
**问题反馈**: GitHub Issues
