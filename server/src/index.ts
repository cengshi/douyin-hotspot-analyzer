import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => {
  res.json({ success: true, data: { status: 'ok' }, error: null });
});

// API 路由占位
app.get('/api/hot/topics', (_, res) => {
  res.json({ success: true, data: [], error: null });
});

app.get('/api/hot/videos', (_, res) => {
  res.json({ success: true, data: [], error: null });
});

app.get('/api/hot/creators', (_, res) => {
  res.json({ success: true, data: [], error: null });
});

app.post('/api/hot/refresh', (_, res) => {
  res.json({ success: true, data: { topics: 0, videos: 0, creators: 0 }, error: null });
});

app.get('/api/docs/today', (_, res) => {
  res.json({ success: true, data: { content: '# 暂无数据', filename: 'empty.md' }, error: null });
});

// 提供静态文件（前端构建产物）
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
