# AI Agent for Paper Curation

自动从arXiv筛选和总结视频理解、多模态大模型和AI Agent相关论文。

## 功能特点

- 🔍 **自动获取**: 每天从arXiv获取最新的video相关论文
- 🤖 **智能筛选**: 使用GPT-4o-mini快速筛选相关论文
- 📝 **详细总结**: 使用GPT-4o详细总结论文内容（中文）
- 🌍 **双语支持**: 自动生成中英文两个版本
- ⏰ **定时运行**: 每天凌晨4点和下午4点自动运行
- 📊 **质量控制**: 通过PR机制人工审核后发布

## 架构

```
scripts/agent/
├── config.js         # 配置文件（筛选标准、模型等）
├── fetcher.js        # arXiv论文获取
├── filter.js         # AI筛选（小模型）
├── summarizer.js     # AI总结（大模型）
├── generator.js      # Markdown生成
├── main.js           # 主程序入口
└── README.md         # 本文档
```

## 工作流程

```
1. 从arXiv获取今日更新的video相关论文
   ↓
2. 使用gpt-4o-mini根据题目和摘要快速筛选
   ↓
3. 对筛选出的论文使用gpt-4o详细总结
   ↓
4. 生成中英文Markdown文件
   ↓
5. 提交到daily-papers目录
   ↓
6. 创建PR供人工审核
```

## 本地使用

### 1. 安装依赖

```bash
cd scripts
npm install
```

### 2. 配置API密钥

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### 3. 运行Agent

```bash
# 完整流程
npm run agent

# 或直接运行
node agent/main.js
```

### 4. 测试单个模块

```bash
# 测试fetcher
node agent/fetcher.js

# 测试filter
node agent/filter.js

# 测试summarizer
node agent/summarizer.js

# 测试generator
node agent/generator.js
```

## GitHub Actions自动化

### 配置步骤

1. **设置Secret**

   在GitHub仓库设置中添加：
   - `OPENAI_API_KEY`: OpenAI API密钥

2. **定时运行**

   已配置为每天凌晨4点和下午4点自动运行（北京时间）

3. **手动触发**

   访问 GitHub Actions → fetch-papers → Run workflow

### 审核流程

1. Agent运行后会自动创建PR
2. 查看PR中的论文列表和总结
3. 检查质量和准确性
4. 合并PR后自动部署

## 配置说明

编辑 `config.js` 可以调整以下参数：

### arXiv搜索

```javascript
arxiv: {
  searchQuery: 'cat:cs.CV+AND+(video+OR+videos)',
  maxResults: 100
}
```

### AI模型

```javascript
ai: {
  filterModel: 'gpt-4o-mini',      // 筛选用小模型
  summarizeModel: 'gpt-4o',        // 总结用大模型
  temperature: 0.3,
  maxTokens: 4000
}
```

### 筛选标准

```javascript
filter: {
  includeKeywords: [
    'video understanding',
    'multimodal llm',
    'agent',
    // ...
  ],
  excludeKeywords: [
    'medical',
    'satellite',
    // ...
  ],
  minRelevanceScore: 6  // 最低相关度评分
}
```

### 输出控制

```javascript
output: {
  directory: 'src/content/blog/posts/daily-papers',
  maxPapersPerDay: 5,              // 每天最多推送论文数
  generateEnglishVersion: true
}
```

## 成本估算

基于每天运行2次，每次处理50篇论文，筛选出3-5篇：

| 任务 | 模型 | Token数 | 单价 | 每日成本 |
|------|------|---------|------|---------|
| 筛选 | gpt-4o-mini | ~50K | $0.15/1M | $0.015 |
| 总结 | gpt-4o | ~30K | $5/1M | $0.15 |
| **每日总计** | | | | **$0.17** |
| **每月总计** | | | | **~$5** |

非常经济实惠！

## 注意事项

1. **API限流**: 论文之间有延迟，避免触发限流
2. **质量控制**: 务必人工审核AI生成的内容
3. **成本监控**: 定期检查API使用量
4. **准确性**: AI可能产生幻觉，以原论文为准

## 故障排除

### OpenAI API错误

```bash
# 检查API密钥
echo $OPENAI_API_KEY

# 测试API连接
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 没有找到论文

- 检查arXiv搜索查询是否正确
- 调整搜索关键词
- 扩大`maxResults`

### 筛选太严格/宽松

- 调整`minRelevanceScore`
- 修改`includeKeywords`和`excludeKeywords`
- 优化筛选prompt

## 开发

### 添加新功能

1. 在对应模块中添加函数
2. 在`main.js`中整合
3. 更新配置文件
4. 测试并提交

### 调试

```bash
# 启用详细日志
export DEBUG=true

# 运行单个模块
node agent/fetcher.js
```

## 相关文档

- [BLOG_STRUCTURE.md](../../BLOG_STRUCTURE.md) - 博客分类体系
- [AI_AGENT_DESIGN.md](../../AI_AGENT_DESIGN.md) - Agent设计方案
- [arXiv API文档](https://info.arxiv.org/help/api/index.html)
- [OpenAI API文档](https://platform.openai.com/docs/api-reference)

---

**更新日期**: 2024-12-23
**版本**: v1.0
