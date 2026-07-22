import { douyinService } from './douyin.js';
import { storage } from './storage.js';

let intervalId: NodeJS.Timeout | null = null;

// 默认刷新间隔：30分钟
const DEFAULT_INTERVAL = 30 * 60 * 1000;

export interface SchedulerCallbacks {
  onStart?: () => void;
  onComplete?: (result: { topics: number; videos: number; creators: number }) => void;
  onError?: (error: Error) => void;
}

export interface SchedulerConfig extends SchedulerCallbacks {
  interval?: number; // 毫秒，可选
}

export const scheduler = {
  /**
   * 启动定时刷新任务
   */
  start(config: SchedulerConfig = {}) {
    const interval = config.interval || DEFAULT_INTERVAL;

    // 立即执行一次
    this.execute(config);

    // 设置定时任务
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      this.execute(config);
    }, interval);

    console.log(`[Scheduler] 定时任务已启动，间隔: ${interval / 1000 / 60} 分钟`);
  },

  /**
   * 执行一次刷新
   */
  async execute(config?: SchedulerCallbacks) {
    console.log('[Scheduler] 开始刷新热点数据...');

    try {
      const result = await douyinService.refreshAll();
      storage.saveTopics(result.topics);
      storage.saveVideos(result.videos);
      storage.saveCreators(result.creators);

      console.log(`[Scheduler] 刷新完成 - 话题: ${result.topics.length}, 视频: ${result.videos.length}, 创作者: ${result.creators.length}`);

      config?.onComplete?.({
        topics: result.topics.length,
        videos: result.videos.length,
        creators: result.creators.length,
      });
    } catch (error) {
      console.error('[Scheduler] 刷新失败:', error);
      config?.onError?.(error as Error);
    }
  },

  /**
   * 停止定时任务
   */
  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log('[Scheduler] 定时任务已停止');
    }
  },

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      running: intervalId !== null,
    };
  },
};
