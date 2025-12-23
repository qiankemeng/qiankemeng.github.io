/**
 * AI Agent Configuration
 * 配置AI论文筛选和总结的参数
 *
 * 环境变量支持：
 * - OPENAI_API_KEY: OpenAI API密钥（必需）
 * - OPENAI_BASE_URL: 自定义API端点（可选）
 * - AI_FILTER_MODEL: 筛选模型（可选）
 * - AI_SUMMARIZE_MODEL: 总结模型（可选）
 */

// ==================== API 配置 ====================

export const apiConfig = {
  // OpenAI API 配置
  openai: {
    // API密钥（从环境变量读取）
    apiKey: process.env.OPENAI_API_KEY || '',

    // API基础URL（可自定义，支持OpenAI兼容接口）
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',

    // 组织ID（可选）
    organization: process.env.OPENAI_ORG_ID || undefined,

    // 超时时间（毫秒）
    timeout: 60000,

    // 最大重试次数
    maxRetries: 3,
  },

  // 其他API提供商配置示例（未来扩展）
  // azure: {
  //   apiKey: process.env.AZURE_API_KEY || '',
  //   baseURL: process.env.AZURE_BASE_URL || '',
  //   deployment: process.env.AZURE_DEPLOYMENT || '',
  // },

  // anthropic: {
  //   apiKey: process.env.ANTHROPIC_API_KEY || '',
  // },
};

// ==================== 模型配置 ====================

export const modelConfig = {
  // 筛选用模型（快速、便宜）
  filter: {
    model: process.env.AI_FILTER_MODEL || 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },

  // 总结用模型（质量高）
  summarize: {
    model: process.env.AI_SUMMARIZE_MODEL || 'gpt-4o',
    temperature: 0.3,
    maxTokens: 4000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  },

  // 可选：其他模型配置
  // 例如使用更便宜的模型组合
  // filter: { model: 'gpt-3.5-turbo', ... },
  // summarize: { model: 'gpt-4o-mini', ... },
};

// ==================== arXiv 配置 ====================

export const arxivConfig = {
  // 搜索查询（与video相关）
  searchQuery: 'cat:cs.CV+AND+(video+OR+videos+OR+visual+OR+multimodal)',

  // 每次获取的最大论文数
  maxResults: 100,

  // API基础URL
  apiBaseUrl: 'http://export.arxiv.org/api/query',

  // 请求超时（毫秒）
  timeout: 30000,
};

// ==================== 筛选配置 ====================

export const filterConfig = {
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
  minRelevanceScore: parseInt(process.env.MIN_RELEVANCE_SCORE || '6'),

  // 批量处理大小
  batchSize: 20,
};

// ==================== 总结配置 ====================

export const summarizeConfig = {
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
  maxLength: 1500,

  // 是否生成英文版本
  generateEnglish: process.env.GENERATE_ENGLISH === 'true' || true,
};

// ==================== 输出配置 ====================

export const outputConfig = {
  // 输出目录（相对于项目根目录）
  directory: 'src/content/blog/posts/daily-papers',

  // 每天最多推送的论文数
  maxPapersPerDay: parseInt(process.env.MAX_PAPERS_PER_DAY || '5'),

  // 文件名格式
  filenamePattern: 'arxiv-{arxivId}-{date}',

  // 是否生成英文版本
  generateEnglishVersion: true,
};

// ==================== 分类映射 ====================

export const categoryMap = {
  'cs.CV': '计算机视觉',
  'cs.AI': '人工智能',
  'cs.LG': '机器学习',
  'cs.CL': '自然语言处理',
  'cs.MM': '多媒体',
  'cs.RO': '机器人',
  'cs.HC': '人机交互',
  'cs.IR': '信息检索'
};

// ==================== 日志配置 ====================

export const loggingConfig = {
  enabled: true,
  level: process.env.LOG_LEVEL || 'info',  // 'debug', 'info', 'warn', 'error'
  logFile: 'agent.log',
  verbose: process.env.VERBOSE === 'true' || false,
};

// ==================== 导出统一配置 ====================

export const config = {
  api: apiConfig,
  model: modelConfig,
  arxiv: arxivConfig,
  filter: filterConfig,
  summarize: summarizeConfig,
  output: outputConfig,
  categoryMap,
  logging: loggingConfig,
};

export default config;

// ==================== 配置验证 ====================

/**
 * 验证必需的配置项
 */
export function validateConfig() {
  const errors = [];

  // 检查API密钥
  if (!apiConfig.openai.apiKey) {
    errors.push('❌ 缺少 OPENAI_API_KEY 环境变量');
  }

  // 检查模型配置
  if (!modelConfig.filter.model) {
    errors.push('❌ 未配置筛选模型');
  }

  if (!modelConfig.summarize.model) {
    errors.push('❌ 未配置总结模型');
  }

  // 检查输出目录
  if (!outputConfig.directory) {
    errors.push('❌ 未配置输出目录');
  }

  if (errors.length > 0) {
    console.error('\n配置错误:\n' + errors.join('\n'));
    return false;
  }

  return true;
}

/**
 * 打印当前配置（用于调试）
 */
export function printConfig() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 当前配置');
  console.log('='.repeat(60));

  console.log('\n🔑 API配置:');
  console.log(`   - Base URL: ${apiConfig.openai.baseURL}`);
  console.log(`   - API Key: ${apiConfig.openai.apiKey ? '***已配置***' : '❌未配置'}`);
  console.log(`   - Timeout: ${apiConfig.openai.timeout}ms`);

  console.log('\n🤖 模型配置:');
  console.log(`   - 筛选模型: ${modelConfig.filter.model}`);
  console.log(`   - 总结模型: ${modelConfig.summarize.model}`);

  console.log('\n📊 筛选配置:');
  console.log(`   - 最低评分: ${filterConfig.minRelevanceScore}/10`);
  console.log(`   - 关键词数: ${filterConfig.includeKeywords.length}`);
  console.log(`   - 排除词数: ${filterConfig.excludeKeywords.length}`);

  console.log('\n📁 输出配置:');
  console.log(`   - 输出目录: ${outputConfig.directory}`);
  console.log(`   - 每日最多: ${outputConfig.maxPapersPerDay} 篇`);
  console.log(`   - 双语版本: ${outputConfig.generateEnglishVersion ? '是' : '否'}`);

  console.log('\n📝 arXiv配置:');
  console.log(`   - 搜索查询: ${arxivConfig.searchQuery}`);
  console.log(`   - 最大结果: ${arxivConfig.maxResults}`);

  console.log('\n' + '='.repeat(60) + '\n');
}
