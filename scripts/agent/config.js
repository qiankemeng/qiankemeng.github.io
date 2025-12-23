/**
 * AI Agent Configuration
 * 配置AI论文筛选和总结的参数
 */

export const config = {
  // arXiv API 配置
  arxiv: {
    // 搜索关键词（与video相关）
    searchQuery: 'cat:cs.CV+AND+(video+OR+videos+OR+visual+OR+multimodal)',

    // 每次获取的最大论文数
    maxResults: 100,

    // API 基础URL
    apiBaseUrl: 'http://export.arxiv.org/api/query'
  },

  // AI 模型配置
  ai: {
    // 筛选用的小模型（快速、便宜）
    filterModel: 'gpt-4o-mini',

    // 总结用的大模型（质量高）
    summarizeModel: 'gpt-4o',

    // OpenAI API 配置
    temperature: 0.3,  // 较低的温度以获得更稳定的输出
    maxTokens: 4000    // 总结的最大token数
  },

  // 筛选标准
  filter: {
    // 必须包含的关键词（满足任意一个）
    includeKeywords: [
      // 视频理解相关
      'video understanding', 'video analysis', 'video captioning',
      'video question answering', 'video qa', 'videoqa',
      'video-language', 'video-text', 'video grounding',
      'temporal understanding', 'temporal reasoning',
      'action recognition', 'video segmentation',
      'long video', 'long-form video',

      // 多模态大模型相关
      'multimodal large language model', 'mllm', 'multimodal llm',
      'vision language model', 'vlm', 'vision-language',
      'visual language model', 'visual question answering', 'vqa',
      'image-text', 'vision-and-language',

      // Agent相关
      'agent', 'agentic', 'multi-agent', 'autonomous agent',
      'embodied ai', 'embodied agent', 'interactive agent',
      'tool use', 'tool using', 'function calling'
    ],

    // 排除的关键词
    excludeKeywords: [
      'medical', 'healthcare', 'clinical', 'radiology',
      'satellite', 'remote sensing', 'astronomy',
      'game', 'gaming', 'video game',
      'compression', 'codec', 'encoding',
      'deepfake', 'face swap',
      'surveillance', 'tracking only'
    ],

    // 最小相关度评分（0-10）
    minRelevanceScore: 6
  },

  // 总结配置
  summarize: {
    // 需要包含的部分
    sections: [
      'core_innovation',    // 核心创新
      'method_overview',    // 方法概述
      'key_results',        // 关键结果
      'personal_comment'    // 个人点评
    ],

    // 总结语言
    language: 'zh',  // 中文

    // 总结长度（字符数）
    maxLength: 1500
  },

  // 输出配置
  output: {
    // 输出目录（相对于项目根目录）
    directory: 'src/content/blog/posts/daily-papers',

    // 每天最多推送的论文数
    maxPapersPerDay: 5,

    // 文件名格式
    filenamePattern: 'arxiv-{arxivId}-{date}',

    // 是否生成英文版本
    generateEnglishVersion: true
  },

  // arXiv 分类映射（用于生成标签）
  categoryMap: {
    'cs.CV': '计算机视觉',
    'cs.AI': '人工智能',
    'cs.LG': '机器学习',
    'cs.CL': '自然语言处理',
    'cs.MM': '多媒体',
    'cs.RO': '机器人',
    'cs.HC': '人机交互',
    'cs.IR': '信息检索'
  },

  // 日志配置
  logging: {
    enabled: true,
    level: 'info',  // 'debug', 'info', 'warn', 'error'
    logFile: 'agent.log'
  }
};

export default config;
