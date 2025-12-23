/**
 * Retry Utilities
 * 提供API调用重试功能，增强鲁棒性
 */

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算指数退避延迟时间
 * @param {number} attempt - 当前尝试次数（从0开始）
 * @param {number} baseDelay - 基础延迟时间（毫秒）
 * @param {number} maxDelay - 最大延迟时间（毫秒）
 */
function calculateBackoff(attempt, baseDelay = 1000, maxDelay = 60000) {
  // 指数退避: baseDelay * 2^attempt，加上随机抖动
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // 0-1秒的随机抖动
  const delay = Math.min(exponentialDelay + jitter, maxDelay);
  return delay;
}

/**
 * 判断错误是否可重试
 */
function isRetryableError(error) {
  // 可重试的错误类型
  const retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'EAI_AGAIN',
  ];

  // 检查错误代码
  if (error.code && retryableErrors.includes(error.code)) {
    return true;
  }

  // 检查HTTP状态码
  if (error.status) {
    // 429: Rate limit
    // 500-599: 服务器错误
    // 408: Request timeout
    if (error.status === 429 || error.status === 408 || (error.status >= 500 && error.status < 600)) {
      return true;
    }
  }

  // 检查错误消息
  const errorMessage = error.message?.toLowerCase() || '';
  const retryableMessages = [
    'timeout',
    'timed out',
    'rate limit',
    'too many requests',
    'overloaded',
    'temporarily unavailable',
    'connection reset',
    'socket hang up',
    'network error',
  ];

  if (retryableMessages.some(msg => errorMessage.includes(msg))) {
    return true;
  }

  return false;
}

/**
 * 带重试的异步函数执行器
 * @param {Function} fn - 要执行的异步函数
 * @param {Object} options - 重试选项
 * @returns {Promise} - 函数执行结果
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,           // 最大重试次数
    baseDelay = 1000,         // 基础延迟（毫秒）
    maxDelay = 60000,         // 最大延迟（毫秒）
    onRetry = null,           // 重试回调函数
    retryableCheck = isRetryableError,  // 自定义可重试错误判断
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 执行函数
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // 如果是最后一次尝试，直接抛出错误
      if (attempt === maxRetries) {
        break;
      }

      // 检查是否应该重试
      if (!retryableCheck(error)) {
        console.log(`❌ 错误不可重试，直接失败: ${error.message}`);
        throw error;
      }

      // 计算延迟时间
      const delay = calculateBackoff(attempt, baseDelay, maxDelay);

      console.log(`⚠️  尝试 ${attempt + 1}/${maxRetries + 1} 失败: ${error.message}`);
      console.log(`⏳ 等待 ${(delay / 1000).toFixed(1)} 秒后重试...`);

      // 调用重试回调
      if (onRetry) {
        await onRetry(attempt, error, delay);
      }

      // 等待后重试
      await sleep(delay);
    }
  }

  // 所有重试都失败了
  console.error(`❌ 重试 ${maxRetries} 次后仍然失败`);
  throw lastError;
}

/**
 * 批量重试包装器
 * 用于包装批量处理的函数，支持单个项目失败后继续处理其他项目
 */
export async function retryBatch(items, processFn, options = {}) {
  const {
    maxRetries = 3,
    continueOnError = true,  // 单个失败是否继续处理其他项
    onItemSuccess = null,
    onItemError = null,
  } = options;

  const results = [];
  const errors = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\n📋 处理项目 ${i + 1}/${items.length}...`);

    try {
      const result = await retryWithBackoff(
        () => processFn(item, i),
        { maxRetries }
      );

      results.push({ success: true, data: result, item });

      if (onItemSuccess) {
        await onItemSuccess(result, item, i);
      }
    } catch (error) {
      console.error(`❌ 项目 ${i + 1} 处理失败: ${error.message}`);

      errors.push({ item, error, index: i });
      results.push({ success: false, error, item });

      if (onItemError) {
        await onItemError(error, item, i);
      }

      // 如果配置为不继续，直接抛出错误
      if (!continueOnError) {
        throw error;
      }
    }

    // 批量处理时，项目之间添加小延迟避免过快请求
    if (i < items.length - 1) {
      await sleep(500);
    }
  }

  return {
    results,
    errors,
    successCount: results.filter(r => r.success).length,
    errorCount: errors.length,
    totalCount: items.length,
  };
}

/**
 * 速率限制包装器
 * 确保不会过快发送请求
 */
export class RateLimiter {
  constructor(maxRequestsPerMinute = 60) {
    this.maxRequests = maxRequestsPerMinute;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // 清除1分钟前的请求记录
    this.requests = this.requests.filter(time => time > oneMinuteAgo);

    // 如果已达到限制，等待
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + 60000 - now;

      if (waitTime > 0) {
        console.log(`⏸️  速率限制：等待 ${(waitTime / 1000).toFixed(1)} 秒...`);
        await sleep(waitTime);
      }

      // 递归调用，重新检查
      return this.acquire();
    }

    // 记录本次请求
    this.requests.push(now);
  }
}

export default {
  retryWithBackoff,
  retryBatch,
  RateLimiter,
  isRetryableError,
};
