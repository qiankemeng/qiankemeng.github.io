/**
 * arXiv Paper Fetcher
 * 从arXiv API获取最新的视频相关论文
 */

import https from 'https';
import http from 'http';
import xml2js from 'xml2js';
import { arxivConfig, categoryMap } from './config.js';

/**
 * 发起HTTP/HTTPS请求
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    // 根据URL协议选择http或https模块
    const client = url.startsWith('https:') ? https : http;

    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * 解析arXiv API返回的XML数据
 */
async function parseArxivXML(xml) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);

  if (!result.feed || !result.feed.entry) {
    return [];
  }

  const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];

  return entries.map(entry => {
    // 提取arXiv ID
    const arxivUrl = entry.id[0];
    const arxivId = arxivUrl.split('/abs/')[1];

    // 提取作者
    const authors = entry.author ? entry.author.map(a => a.name[0]) : [];

    // 提取分类
    const categories = entry.category ? entry.category.map(c => c.$.term) : [];

    // 提取日期
    const published = entry.published ? entry.published[0].split('T')[0] : '';
    const updated = entry.updated ? entry.updated[0].split('T')[0] : '';

    return {
      arxivId,
      title: entry.title[0].trim().replace(/\n\s+/g, ' '),
      summary: entry.summary[0].trim().replace(/\n\s+/g, ' '),
      authors,
      categories,
      published,
      updated,
      arxivUrl: `https://arxiv.org/abs/${arxivId}`,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`
    };
  });
}

/**
 * 从arXiv获取今天更新的论文
 */
export async function fetchTodayPapers() {
  console.log('📥 正在从 arXiv 获取今日更新的论文...');

  // 构建查询URL - 获取最近24小时内提交或更新的论文
  const query = encodeURIComponent(arxivConfig.searchQuery);
  const url = `${arxivConfig.apiBaseUrl}?search_query=${query}&start=0&max_results=${arxivConfig.maxResults}&sortBy=submittedDate&sortOrder=descending`;

  console.log(`🔍 查询URL: ${url}`);

  try {
    const xml = await httpGet(url);
    const papers = await parseArxivXML(xml);

    // 过滤出今天或昨天更新的论文（考虑时区差异）
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const recentPapers = papers.filter(paper => {
      // 使用updated日期（最后更新时间）而不是published
      return paper.updated === todayStr || paper.updated === yesterdayStr;
    });

    console.log(`✅ 共获取 ${papers.length} 篇论文`);
    console.log(`📅 其中 ${recentPapers.length} 篇为今日或昨日更新`);

    return recentPapers;
  } catch (error) {
    console.error('❌ 获取论文失败:', error.message);
    throw error;
  }
}

/**
 * 获取指定arXiv ID的论文元数据
 */
export async function fetchPaperById(arxivId) {
  console.log(`📥 获取论文元数据: ${arxivId}`);

  const cleanId = arxivId.replace('https://arxiv.org/abs/', '').replace('arxiv:', '');
  const url = `${arxivConfig.apiBaseUrl}?id_list=${cleanId}`;

  try {
    const xml = await httpGet(url);
    const papers = await parseArxivXML(xml);

    if (papers.length === 0) {
      throw new Error(`未找到论文: ${arxivId}`);
    }

    return papers[0];
  } catch (error) {
    console.error(`❌ 获取论文 ${arxivId} 失败:`, error.message);
    throw error;
  }
}

/**
 * 测试函数
 */
export async function testFetcher() {
  console.log('🧪 测试 arXiv Fetcher...\n');

  try {
    const papers = await fetchTodayPapers();
    console.log(`\n✅ 成功获取 ${papers.length} 篇论文`);

    if (papers.length > 0) {
      console.log('\n📝 第一篇论文示例:');
      console.log(JSON.stringify(papers[0], null, 2));
    }
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
  }
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testFetcher();
}
