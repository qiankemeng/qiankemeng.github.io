#!/usr/bin/env node

/**
 * AI Agent Main Entry Point
 * 自动筛选和总结arXiv论文的主程序
 */

import { fetchTodayPapers } from './fetcher.js';
import { filterPapersBatch } from './filter.js';
import { summarizePapers, generateEnglishSummary } from './summarizer.js';
import { savePapersAsMarkdown, generateReport } from './generator.js';
import { validateConfig, printConfig, outputConfig, summarizeConfig, loggingConfig } from './config.js';

/**
 * 主函数
 */
async function main() {
  console.log('🚀 AI Agent 启动...\n');

  // 验证配置
  if (!validateConfig()) {
    console.error('\n❌ 配置验证失败，请检查环境变量');
    process.exit(1);
  }

  // 打印当前配置
  printConfig();

  console.log('=' .repeat(60));
  console.log('📅 运行时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  console.log('🎯 目标: 自动筛选和总结视频理解相关论文');
  console.log('=' .repeat(60) + '\n');

  const startTime = Date.now();

  try {
    // 步骤1: 从arXiv获取今日更新的论文
    console.log('📥 步骤 1/5: 获取论文');
    console.log('-'.repeat(60));
    const allPapers = await fetchTodayPapers();

    if (allPapers.length === 0) {
      console.log('\nℹ️  没有找到今日更新的论文，程序退出');
      return;
    }

    // 步骤2: 使用AI筛选相关论文
    console.log('\n🤖 步骤 2/5: AI筛选');
    console.log('-'.repeat(60));
    const filteredPapers = await filterPapersBatch(allPapers);

    if (filteredPapers.length === 0) {
      console.log('\nℹ️  没有论文通过筛选，程序退出');
      return;
    }

    // 步骤3: 使用AI详细总结论文
    console.log('\n📝 步骤 3/5: AI总结');
    console.log('-'.repeat(60));
    const summarizedPapers = await summarizePapers(filteredPapers);

    if (summarizedPapers.length === 0) {
      console.log('\nℹ️  没有论文完成总结，程序退出');
      return;
    }

    // 步骤4: 生成英文版本（可选）
    if (outputConfig.generateEnglishVersion) {
      console.log('\n🌍 步骤 4/5: 生成英文版本');
      console.log('-'.repeat(60));

      for (let i = 0; i < summarizedPapers.length; i++) {
        console.log(`处理 ${i + 1}/${summarizedPapers.length}...`);
        summarizedPapers[i] = await generateEnglishSummary(summarizedPapers[i]);

        if (i < summarizedPapers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } else {
      console.log('\n⏭️  步骤 4/5: 跳过英文版本生成');
    }

    // 步骤5: 生成Markdown文件
    console.log('\n💾 步骤 5/5: 生成Markdown文件');
    console.log('-'.repeat(60));
    const savedFiles = savePapersAsMarkdown(summarizedPapers);

    // 生成运行报告
    const report = generateReport(summarizedPapers, savedFiles);

    // 打印最终结果
    console.log('\n' + '='.repeat(60));
    console.log('✅ AI Agent 运行完成');
    console.log('='.repeat(60));
    console.log(`📊 统计信息:`);
    console.log(`   - 扫描论文: ${allPapers.length} 篇`);
    console.log(`   - 筛选通过: ${filteredPapers.length} 篇`);
    console.log(`   - 完成总结: ${summarizedPapers.length} 篇`);
    console.log(`   - 生成文件: ${savedFiles.length} 篇`);
    console.log(`   - 运行时长: ${((Date.now() - startTime) / 1000).toFixed(1)}秒`);
    console.log('='.repeat(60) + '\n');

    // 如果生成了新文件，打印提示
    if (savedFiles.length > 0) {
      console.log('📢 下一步操作:');
      console.log('   1. 查看生成的文章内容');
      console.log('   2. 如有需要，手动调整内容');
      console.log('   3. 提交到Git仓库');
      console.log('   4. 创建Pull Request供审核\n');
    }

    // 输出详细报告（可选）
    if (loggingConfig.enabled) {
      console.log('\n--- 详细报告 ---\n');
      console.log(report);
    }

  } catch (error) {
    console.error('\n❌ AI Agent 运行失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * 错误处理
 */
process.on('unhandledRejection', (error) => {
  console.error('\n❌ 未处理的Promise拒绝:', error);
  process.exit(1);
});

// 检查环境变量
if (!process.env.OPENAI_API_KEY) {
  console.error('\n❌ 错误: 未设置 OPENAI_API_KEY 环境变量');
  console.error('\n请设置环境变量:');
  console.error('  export OPENAI_API_KEY=your-api-key\n');
  process.exit(1);
}

// 运行主函数
main();
