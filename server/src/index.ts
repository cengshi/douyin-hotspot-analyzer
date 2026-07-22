import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './services/storage.js';
import { douyinService } from './services/douyin.js';
import { markdownService } from './services/markdown.js';
import { scheduler } from './services/scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => {
  const lastUpdated = storage.getLastUpdated();
  const schedulerStatus = scheduler.getStatus();
  res.json({
    success: true,
    data: { status: 'ok', lastUpdated, scheduler: schedulerStatus },
    error: null
  });
});

// ============ 热点相关 API ============

// 获取热搜话题
app.get('/api/hot/topics', (_, res) => {
  try {
    const topics = storage.getTopics();
    res.json({ success: true, data: topics, error: null });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to get topics' });
  }
});

// 获取热门视频
app.get('/api/hot/videos', (_, res) => {
  try {
    const videos = storage.getVideos();
    res.json({ success: true, data: videos, error: null });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to get videos' });
  }
});

// 获取热门创作者
app.get('/api/hot/creators', (_, res) => {
  try {
    const creators = storage.getCreators();
    res.json({ success: true, data: creators, error: null });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to get creators' });
  }
});

// 刷新热点数据
app.post('/api/hot/refresh', async (_, res) => {
  try {
    const { topics, videos, creators } = await douyinService.refreshAll();
    storage.saveTopics(topics);
    storage.saveVideos(videos);
    storage.saveCreators(creators);
    res.json({
      success: true,
      data: { topics: topics.length, videos: videos.length, creators: creators.length },
      error: null
    });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to refresh data' });
  }
});

// ============ 定时任务 API ============

// 获取定时任务状态
app.get('/api/scheduler/status', (_, res) => {
  res.json({
    success: true,
    data: scheduler.getStatus(),
    error: null
  });
});

// 启动定时任务
app.post('/api/scheduler/start', (req, res) => {
  const interval = req.body?.interval || 30 * 60 * 1000; // 默认30分钟
  scheduler.start({
    interval,
    onStart: () => console.log('[API] 定时任务已启动'),
    onComplete: (result) => console.log(`[API] 定时刷新完成: ${JSON.stringify(result)}`),
    onError: (error) => console.error('[API] 定时刷新失败:', error),
  });
  res.json({ success: true, data: { message: '定时任务已启动' }, error: null });
});

// 停止定时任务
app.post('/api/scheduler/stop', (_, res) => {
  scheduler.stop();
  res.json({ success: true, data: { message: '定时任务已停止' }, error: null });
});

// 手动执行一次刷新
app.post('/api/scheduler/execute', async (_, res) => {
  try {
    const result = await douyinService.refreshAll();
    storage.saveTopics(result.topics);
    storage.saveVideos(result.videos);
    storage.saveCreators(result.creators);
    res.json({
      success: true,
      data: { topics: result.topics.length, videos: result.videos.length, creators: result.creators.length },
      error: null
    });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to refresh' });
  }
});

// ============ 文档相关 API ============

// 获取今日 Markdown 文档
app.get('/api/docs/today', (_, res) => {
  try {
    const topics = storage.getTopics();
    const videos = storage.getVideos();
    const creators = storage.getCreators();

    const content = markdownService.generateDailyReport(topics, videos, creators);
    const filename = markdownService.getFilename();

    res.json({ success: true, data: { content, filename }, error: null });
  } catch (error) {
    res.json({ success: false, data: null, error: 'Failed to generate report' });
  }
});

// 导出 Markdown 文件
app.get('/api/docs/export', (_, res) => {
  try {
    const topics = storage.getTopics();
    const videos = storage.getVideos();
    const creators = storage.getCreators();

    const content = markdownService.generateDailyReport(topics, videos, creators);
    const filename = markdownService.getFilename();

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  } catch (error) {
    res.status(500).json({ success: false, data: null, error: 'Failed to export' });
  }
});

// ============ 静态文件 ============

// 提供静态文件（前端构建产物）
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // 启动时自动刷新一次数据
  scheduler.execute({
    onComplete: (result) => {
      console.log(`初始数据加载完成: 话题${result.topics}条, 视频${result.videos}个, 创作者${result.creators}位`);
    },
    onError: (error) => {
      console.error('初始数据加载失败:', error);
    }
  });

  // 启动定时任务（默认30分钟刷新一次）
  scheduler.start({
    interval: 30 * 60 * 1000, // 30分钟
    onComplete: (result) => {
      console.log(`[定时] 数据已刷新: 话题${result.topics}条`);
    }
  });
});
