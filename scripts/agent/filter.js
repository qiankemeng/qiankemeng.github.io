/**
 * AI Paper Filter
 * 使用小模型快速筛选视频理解相关的论文
 */

import OpenAI from 'openai';
import { apiConfig, modelConfig, filterConfig } from './config.js';
import { retryWithBackoff } from './retry-utils.js';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: apiConfig.openai.apiKey,
  baseURL: apiConfig.openai.baseURL,
  organization: apiConfig.openai.organization,
  timeout: apiConfig.openai.timeout,
  maxRetries: apiConfig.openai.maxRetries,
});

/**
 * 构建筛选prompt
 */
function buildFilterPrompt(papers) {
  const includeKeywords = filterConfig.includeKeywords.join(', ');
  const excludeKeywords = filterConfig.excludeKeywords.join(', ');

  return `你是一个AI研究助手，专注于视频理解、多模态大模型(MLLM)和AI Agent领域。

你的任务是从以下论文列表中筛选出与这些领域**高度相关**的论文。

## 筛选标准

### 关注领域（必须高度相关）：
1. **视频理解**: ${includeKeywords}
2. **排除领域**: ${excludeKeywords}

### 评分标准（0-10分）：
- 10分: 核心论文，直接解决视频理解/MLLM/Agent问题
- 8-9分: 高度相关，有重要创新
- 6-7分: 相关但不是核心贡献
- 4-5分: 边缘相关
- 0-3分: 不相关或在排除列表中

### 论文列表（共 ${papers.length} 篇）：

${papers.map((p, i) => `
### 论文 ${i + 1}
**ID**: ${p.arxivId}
**标题**: ${p.title}
**摘要**: ${p.summary.substring(0, 500)}...
**分类**: ${p.categories.join(', ')}
`).join('\n---\n')}

## 输出要求

请以JSON格式返回筛选结果，只包含评分 >= ${filterConfig.minRelevanceScore} 的论文：

\`\`\`json
{
  "selected_papers": [
    {
      "arxiv_id": "2404.12345",
      "score": 9,
      "reason": "简短的筛选理由（1-2句话）",
      "tags": ["视频理解", "多模态", "长视频"]
    }
  ],
  "total_selected": 3,
  "total_reviewed": ${papers.length}
}
\`\`\`

注意：
1. 只返回高质量、高相关度的论文
2. reason要简洁明了，突出核心创新点
3. tags要准确反映论文的研究方向
4. 严格排除医疗、遥感、游戏等领域`;
}

/**
 * 使用AI筛选论文（带重试）
 */
export async function filterPapers(papers) {
  if (papers.length === 0) {
    console.log('ℹ️ 没有论文需要筛选');
    return [];
  }

  console.log(`\n🤖 使用 ${modelConfig.filter.model} 筛选 ${papers.length} 篇论文...`);

  try {
    // 使用重试包装API调用
    const response = await retryWithBackoff(
      async () => {
        return await openai.chat.completions.create({
          model: modelConfig.filter.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI研究论文筛选助手，专注于视频理解、多模态大模型和AI Agent领域。你的任务是快速准确地识别高质量的相关论文。'
            },
            {
              role: 'user',
              content: buildFilterPrompt(papers)
            }
          ],
          temperature: modelConfig.filter.temperature,
          max_tokens: modelConfig.filter.maxTokens,
          top_p: modelConfig.filter.topP,
          frequency_penalty: modelConfig.filter.frequencyPenalty,
          presence_penalty: modelConfig.filter.presencePenalty,
          response_format: { type: 'json_object' }
        });
      },
      {
        maxRetries: apiConfig.openai.maxRetries,
        baseDelay: 2000,  // 2秒基础延迟
        maxDelay: 30000,  // 最多30秒
        onRetry: (attempt, error) => {
          console.log(`🔄 筛选API重试中 (${attempt + 1}/${apiConfig.openai.maxRetries})...`);
        }
      }
    );

    const result = JSON.parse(response.choices[0].message.content);

    console.log(`✅ 筛选完成: ${result.total_selected}/${result.total_reviewed} 篇论文通过`);

    // 将筛选结果与原始论文数据合并
    const selectedPapers = result.selected_papers.map(selected => {
      const paper = papers.find(p => p.arxivId === selected.arxiv_id);
      return {
        ...paper,
        filterScore: selected.score,
        filterReason: selected.reason,
        suggestedTags: selected.tags || []
      };
    });

    // 按评分排序
    selectedPapers.sort((a, b) => b.filterScore - a.filterScore);

    // 输出筛选结果摘要
    console.log('\n📊 筛选结果摘要:');
    selectedPapers.forEach((paper, i) => {
      console.log(`${i + 1}. [${paper.filterScore}/10] ${paper.title}`);
      console.log(`   理由: ${paper.filterReason}`);
      console.log(`   标签: ${paper.suggestedTags.join(', ')}\n`);
    });

    return selectedPapers;
  } catch (error) {
    console.error('❌ 筛选失败:', error.message);
    throw error;
  }
}

/**
 * 批量筛选（处理大量论文时分批进行）
 */
export async function filterPapersBatch(papers) {
  const batchSize = filterConfig.batchSize;
  const batches = [];

  for (let i = 0; i < papers.length; i += batchSize) {
    batches.push(papers.slice(i, i + batchSize));
  }

  console.log(`📦 将 ${papers.length} 篇论文分为 ${batches.length} 批进行筛选`);

  const allSelected = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`\n处理第 ${i + 1}/${batches.length} 批...`);
    const selected = await filterPapers(batches[i]);
    allSelected.push(...selected);

    // 避免API限流，批次之间延迟1秒
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // 按评分排序并返回前N篇
  allSelected.sort((a, b) => b.filterScore - a.filterScore);
  const maxPapers = filterConfig.maxPapersPerDay || 5;
  const topPapers = allSelected.slice(0, maxPapers);

  console.log(`\n✅ 总计筛选出 ${allSelected.length} 篇论文`);
  console.log(`📌 选择评分最高的 ${topPapers.length} 篇进行总结\n`);

  return topPapers;
}

/**
 * 测试函数
 */
export async function testFilter() {
  console.log('🧪 测试 AI Filter...\n');

  // 模拟论文数据
  const mockPapers = [
    {
      arxivId: '2404.12345',
      title: 'VideoLLaMA: A Multimodal Large Language Model for Video Understanding',
      summary: 'We present VideoLLaMA, a multimodal large language model for video understanding...',
      categories: ['cs.CV', 'cs.AI']
    },
    {
      arxivId: '2404.12346',
      title: 'Medical Image Segmentation using Deep Learning',
      summary: 'This paper proposes a novel approach for medical image segmentation...',
      categories: ['cs.CV']
    }
  ];

  try {
    const selected = await filterPapers(mockPapers);
    console.log('\n✅ 测试成功');
    console.log(`筛选出 ${selected.length} 篇论文`);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
  }
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testFilter();
}
