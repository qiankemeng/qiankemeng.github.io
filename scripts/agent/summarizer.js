/**
 * AI Paper Summarizer
 * 使用大模型详细总结论文内容
 */

import OpenAI from 'openai';
import { apiConfig, modelConfig, summarizeConfig } from './config.js';
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
 * 构建总结prompt
 */
function buildSummarizePrompt(paper) {
  return `你是一个专业的AI研究论文分析师，专注于视频理解、多模态大模型和AI Agent领域。

请仔细阅读以下论文信息，并用**中文**撰写一篇详细的论文总结。

## 论文信息

**标题**: ${paper.title}

**作者**: ${paper.authors.join(', ')}

**arXiv ID**: ${paper.arxivId}

**摘要**:
${paper.summary}

**分类**: ${paper.categories.join(', ')}

${paper.filterReason ? `**筛选理由**: ${paper.filterReason}` : ''}

---

## 总结要求

请按照以下结构撰写总结（使用Markdown格式）：

### 1. 核心创新 (2-3段)
- 这篇论文的主要创新点是什么？
- 与现有方法相比有什么突破？
- 为什么这个创新很重要？

### 2. 方法概述 (3-4段)
- 论文提出的方法是什么？
- 技术架构是怎样的？
- 关键技术细节有哪些？
- 如何实现的？

### 3. 实验结果 (2-3段)
- 在哪些数据集上进行了实验？
- 主要性能指标是什么？
- 与baseline方法对比如何？
- 有哪些值得关注的实验发现？

### 4. 个人点评 (1-2段)
- 这篇论文的优势是什么？
- 可能的局限性或改进方向？
- 对该领域的影响和意义？
- 值得关注的原因？

---

## 写作要求

1. **语言**: 使用流畅的中文学术语言
2. **长度**: 总计约1000-1500字
3. **风格**: 专业但易懂，适合AI研究者阅读
4. **重点**: 突出核心创新和实用价值
5. **格式**: 使用Markdown格式，合理使用标题、列表、加粗等
6. **客观性**: 基于摘要内容进行分析，不要过度推测

请直接输出Markdown格式的总结内容，不要包含额外的说明。`;
}

/**
 * 使用AI总结单篇论文（带重试）
 */
export async function summarizePaper(paper) {
  console.log(`\n📝 总结论文: ${paper.title}...`);

  try {
    // 使用重试包装API调用
    const response = await retryWithBackoff(
      async () => {
        return await openai.chat.completions.create({
          model: modelConfig.summarize.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI研究论文分析师，擅长用清晰易懂的中文总结视频理解、多模态和AI Agent相关的论文。你的总结既要保持学术严谨性，又要通俗易懂。'
            },
            {
              role: 'user',
              content: buildSummarizePrompt(paper)
            }
          ],
          temperature: modelConfig.summarize.temperature,
          max_tokens: modelConfig.summarize.maxTokens,
          top_p: modelConfig.summarize.topP,
          frequency_penalty: modelConfig.summarize.frequencyPenalty,
          presence_penalty: modelConfig.summarize.presencePenalty,
        });
      },
      {
        maxRetries: apiConfig.openai.maxRetries,
        baseDelay: 3000,  // 3秒基础延迟（总结更慢）
        maxDelay: 60000,  // 最多60秒
        onRetry: (attempt, error) => {
          console.log(`🔄 总结API重试中 (${attempt + 1}/${apiConfig.openai.maxRetries})...`);
          console.log(`   错误: ${error.message}`);
        }
      }
    );

    const summary = response.choices[0].message.content;

    console.log(`✅ 总结完成 (${summary.length} 字符)`);

    return {
      ...paper,
      summary_zh: summary,
      summary_generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ 总结论文 ${paper.arxivId} 失败:`, error.message);
    throw error;
  }
}

/**
 * 批量总结论文
 */
export async function summarizePapers(papers) {
  console.log(`\n🤖 开始总结 ${papers.length} 篇论文 (使用 ${modelConfig.summarize.model})...\n`);

  const summarizedPapers = [];

  for (let i = 0; i < papers.length; i++) {
    console.log(`\n--- 进度: ${i + 1}/${papers.length} ---`);

    try {
      const summarized = await summarizePaper(papers[i]);
      summarizedPapers.push(summarized);

      // 避免API限流，论文之间延迟2秒
      if (i < papers.length - 1) {
        console.log('⏳ 等待2秒...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`跳过论文 ${papers[i].arxivId}: ${error.message}`);
      // 继续处理下一篇
    }
  }

  console.log(`\n✅ 总结完成: ${summarizedPapers.length}/${papers.length} 篇成功\n`);

  return summarizedPapers;
}

/**
 * 生成英文版本的简短总结
 */
export async function generateEnglishSummary(paper) {
  // 检查配置是否启用英文总结
  if (!summarizeConfig.generateEnglish) {
    return paper;
  }

  console.log(`\n🌍 生成英文版本: ${paper.arxivId}...`);

  const prompt = `Based on the following paper information, write a concise English summary (300-500 words):

**Title**: ${paper.title}
**Abstract**: ${paper.summary}

Please structure the summary as:
1. **Core Innovation** (1-2 paragraphs)
2. **Method Overview** (2-3 paragraphs)
3. **Key Results** (1-2 paragraphs)

Use clear, professional English suitable for AI researchers.`;

  try {
    // 使用重试包装API调用
    const response = await retryWithBackoff(
      async () => {
        return await openai.chat.completions.create({
          model: modelConfig.summarize.model,
          messages: [
            {
              role: 'system',
              content: 'You are an AI research paper analyst specializing in video understanding, multimodal models, and AI agents.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: modelConfig.summarize.temperature,
          max_tokens: 2000,
          top_p: modelConfig.summarize.topP,
        });
      },
      {
        maxRetries: apiConfig.openai.maxRetries,
        baseDelay: 3000,
        maxDelay: 60000,
        onRetry: (attempt) => {
          console.log(`🔄 英文总结API重试中 (${attempt + 1}/${apiConfig.openai.maxRetries})...`);
        }
      }
    );

    const summary_en = response.choices[0].message.content;
    console.log(`✅ 英文总结完成`);

    return {
      ...paper,
      summary_en
    };
  } catch (error) {
    console.error(`❌ 生成英文总结失败:`, error.message);
    // 如果英文总结失败，返回原论文对象
    return paper;
  }
}

/**
 * 测试函数
 */
export async function testSummarizer() {
  console.log('🧪 测试 AI Summarizer...\n');

  const mockPaper = {
    arxivId: '2404.12345',
    title: 'VideoLLaMA: A Multimodal Large Language Model for Video Understanding',
    summary: 'We present VideoLLaMA, a multimodal large language model designed specifically for video understanding tasks. Our model combines a video encoder with a large language model to enable comprehensive video analysis, including temporal reasoning, action recognition, and video question answering. Extensive experiments demonstrate state-of-the-art performance on multiple benchmarks.',
    authors: ['John Doe', 'Jane Smith'],
    categories: ['cs.CV', 'cs.AI'],
    filterReason: '该论文直接解决视频理解和多模态大模型问题，具有重要创新'
  };

  try {
    const summarized = await summarizePaper(mockPaper);
    console.log('\n✅ 测试成功');
    console.log('\n--- 生成的总结 ---');
    console.log(summarized.summary_zh);
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
  }
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testSummarizer();
}
