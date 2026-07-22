import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './services/storage.js';
import { douyinService } from './services/douyin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => {
  const lastUpdated = storage.getLastUpdated();
  res.json({ success: true, data: { status: 'ok', lastUpdated }, error: null });
});

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

// 获取今日文档（临时占位）
app.get('/api/docs/today', (_, res) => {
  res.json({ success: true, data: { content: '# 暂无数据\n\n请先刷新热点数据', filename: 'empty.md' }, error: null });
});

// 提供静态文件（前端构建产物）
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
