# Douyin Hot Spot Analyzer - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个抖音热点分析工具，支持实时获取热搜、生成 Markdown 文档、Web 界面展示

**Architecture:** 前后分离架构 - Express API 后端 + React 前端，数据存储使用 SQLite

**Tech Stack:**
- 后端: Node.js + Express + TypeScript + better-sqlite3
- 前端: React + TypeScript + Vite + Tailwind CSS
- 第三方 SDK: TikTokApi (Python port via subprocess) 或自封装请求

---

## 全局约束

- Node.js >= 18
- TypeScript strict mode
- 所有 API 返回统一格式 `{ success, data, error }`
- 数据库: SQLite (文件: `data/hotspot.db`)
- 前端路由: React Router v6
- 样式: Tailwind CSS v3

---

## 项目结构

```
auto-skip/
├── server/                    # 后端
│   ├── src/
│   │   ├── index.ts          # 入口
│   │   ├── routes/           # API 路由
│   │   │   ├── hot.ts       # 热点 API
│   │   │   └── docs.ts      # 文档 API
│   │   ├── services/        # 业务逻辑
│   │   │   ├── douyin.ts    # 抖音 API 调用
│   │   │   ├── storage.ts   # 数据库操作
│   │   │   └── markdown.ts  # Markdown 生成
│   │   ├── types/           # 类型定义
│   │   │   └── index.ts
│   │   └── utils/          # 工具函数
│   │       └── format.ts    # 格式化工具
│   └── data/                # SQLite 数据库
├── client/                   # 前端
│   ├── src/
│   │   ├── main.tsx        # 入口
│   │   ├── App.tsx         # 根组件
│   │   ├── pages/          # 页面
│   │   │   ├── Home.tsx    # 热点概览
│   │   │   ├── Topic.tsx   # 话题详情
│   │   │   ├── Docs.tsx    # 文档中心
│   │   │   └── Settings.tsx # 设置
│   │   ├── components/      # 组件
│   │   │   ├── HotTopicCard.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   ├── CreatorCard.tsx
│   │   │   ├── MarkdownPreview.tsx
│   │   │   └── RefreshButton.tsx
│   │   ├── hooks/          # 自定义 Hooks
│   │   │   └── useHotData.ts
│   │   ├── api/            # API 调用
│   │   │   └── client.ts
│   │   └── types/          # 前端类型
│   │       └── index.ts
│   └── index.html
├── docs/                    # 文档
│   ├── specs/              # 设计文档
│   └── plans/             # 实现计划
└── package.json
```

---

## 任务清单

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `tsconfig.json` (server)
- Create: `server/tsconfig.json`
- Create: `client/package.json`
- Create: `client/vite.config.ts`
- Create: `client/tsconfig.json`
- Create: `client/index.html`
- Create: `server/src/index.ts`
- Create: `server/src/types/index.ts`

**Interfaces:**
- Produces: 项目基础结构，TypeScript 配置

- [ ] **Step 1: 创建项目根目录结构和配置文件**

```json
// package.json
{
  "name": "douyin-hotspot-analyzer",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "npm run build:server && npm run build:client",
    "build:server": "cd server && npm run build",
    "build:client": "cd client && npm run build",
    "install:all": "npm install && cd server && npm install && cd ../client && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

```json
// tsconfig.json (根目录)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules", "server", "client"]
}
```

- [ ] **Step 2: 创建服务端配置**

```json
// server/package.json
{
  "name": "douyin-hotspot-server",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "better-sqlite3": "^9.4.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/better-sqlite3": "^7.6.8",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

```json
// server/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: 创建客户端配置**

```json
// client/package.json
{
  "name": "douyin-hotspot-client",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

```json
// client/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建服务端基础文件**

```typescript
// server/src/types/index.ts
export interface HotTopic {
  id: string;
  word: string;
  hotValue: number;
  rank: number;
  link: string;
  fetchedAt: string;
}

export interface Video {
  id: string;
  title: string;
  author: Creator;
  likes: number;
  comments: number;
  shares: number;
  coverUrl: string;
  fetchedAt: string;
}

export interface Creator {
  id: string;
  nickname: string;
  avatar: string;
  followers: number;
  verified: boolean;
  fetchedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}
```

```typescript
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import hotRouter from './routes/hot.js';
import docsRouter from './routes/docs.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/hot', hotRouter);
app.use('/api/docs', docsRouter);

app.get('/api/health', (_, res) => {
  res.json({ success: true, data: { status: 'ok' }, error: null });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 5: 创建客户端入口文件**

```html
<!-- client/index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>抖音热点分析器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```typescript
// client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

```css
/* client/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: 安装依赖并验证项目启动**

Run: `npm run install:all`
Expected: 所有依赖安装成功

Run: `npm run dev`
Expected: 服务端和客户端都正常启动

- [ ] **Step 7: 提交代码**

```bash
git add -A
git commit -m "feat: project initialization with Express + React setup"
```

---

### Task 2: 数据库和存储服务

**Files:**
- Create: `server/src/services/storage.ts`
- Create: `server/data/.gitkeep`
- Modify: `server/src/services/douyin.ts`

**Interfaces:**
- Consumes: `HotTopic`, `Video`, `Creator` 类型
- Produces: `StorageService` 类，提供 `saveTopics`, `getTopics`, `getVideos`, `getCreators` 方法

- [ ] **Step 1: 创建存储服务**

```typescript
// server/src/services/storage.ts
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { HotTopic, Video, Creator } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/hotspot.db');

let db: Database.Database;

function initDb() {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS hot_topics (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      hotValue INTEGER,
      rank INTEGER,
      link TEXT,
      fetchedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT,
      authorId TEXT,
      authorNickname TEXT,
      authorAvatar TEXT,
      likes INTEGER,
      comments INTEGER,
      shares INTEGER,
      coverUrl TEXT,
      fetchedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS creators (
      id TEXT PRIMARY KEY,
      nickname TEXT,
      avatar TEXT,
      followers INTEGER,
      verified INTEGER,
      fetchedAt TEXT
    );
  `);

  return db;
}

export const storage = {
  db: initDb(),

  saveTopics(topics: HotTopic[]) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO hot_topics (id, word, hotValue, rank, link, fetchedAt)
      VALUES (@id, @word, @hotValue, @rank, @link, @fetchedAt)
    `);

    const insert = this.db.transaction((items: HotTopic[]) => {
      for (const item of items) stmt.run(item);
    });

    insert(topics);
  },

  getTopics(limit = 50): HotTopic[] {
    return this.db.prepare('SELECT * FROM hot_topics ORDER BY rank LIMIT ?').all(limit) as HotTopic[];
  },

  saveVideos(videos: Video[]) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO videos
      (id, title, authorId, authorNickname, authorAvatar, likes, comments, shares, coverUrl, fetchedAt)
      VALUES (@id, @title, @authorId, @authorNickname, @authorAvatar, @likes, @comments, @shares, @coverUrl, @fetchedAt)
    `);

    const insert = this.db.transaction((items: Video[]) => {
      for (const v of items) {
        stmt.run({
          id: v.id,
          title: v.title,
          authorId: v.author?.id || '',
          authorNickname: v.author?.nickname || '',
          authorAvatar: v.author?.avatar || '',
          likes: v.likes,
          comments: v.comments,
          shares: v.shares,
          coverUrl: v.coverUrl,
          fetchedAt: v.fetchedAt,
        });
      }
    });

    insert(videos);
  },

  getVideos(limit = 30): Video[] {
    const rows = this.db.prepare('SELECT * FROM videos ORDER BY likes DESC LIMIT ?').all(limit) as any[];
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      author: {
        id: row.authorId,
        nickname: row.authorNickname,
        avatar: row.authorAvatar,
        followers: 0,
        verified: false,
        fetchedAt: row.fetchedAt,
      },
      likes: row.likes,
      comments: row.comments,
      shares: row.shares,
      coverUrl: row.coverUrl,
      fetchedAt: row.fetchedAt,
    }));
  },

  saveCreators(creators: Creator[]) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO creators (id, nickname, avatar, followers, verified, fetchedAt)
      VALUES (@id, @nickname, @avatar, @followers, @verified, @fetchedAt)
    `);

    const insert = this.db.transaction((items: Creator[]) => {
      for (const c of items) {
        stmt.run({ ...c, verified: c.verified ? 1 : 0 });
      }
    });

    insert(creators);
  },

  getCreators(limit = 20): Creator[] {
    const rows = this.db.prepare('SELECT * FROM creators ORDER BY followers DESC LIMIT ?').all(limit) as any[];
    return rows.map(row => ({
      ...row,
      verified: row.verified === 1,
    }));
  },
};
```

- [ ] **Step 2: 创建 data 目录占位文件**

```bash
touch server/data/.gitkeep
```

- [ ] **Step 3: 提交代码**

```bash
git add -A
git commit -m "feat: add SQLite storage service"
```

---

### Task 3: 抖音数据获取服务

**Files:**
- Create: `server/src/services/douyin.ts`
- Create: `server/src/utils/format.ts`

**Interfaces:**
- Consumes: 无
- Produces: `DouyinService` 对象，提供 `fetchHotTopics`, `fetchHotVideos`, `fetchHotCreators` 方法

**Notes:**
- 使用网页爬取方式获取热搜（最简单可行）
- 抖音网页版热搜: `https://www.douyin.com/hotlist`
- 返回模拟数据用于开发测试

- [ ] **Step 1: 创建格式化工具**

```typescript
// server/src/utils/format.ts
export function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
}

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function formatDateTime(date: Date = new Date()): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
```

- [ ] **Step 2: 创建抖音数据服务（使用模拟数据）**

```typescript
// server/src/services/douyin.ts
import { HotTopic, Video, Creator } from '../types/index.js';
import { storage } from './storage.js';

// 模拟数据 - 实际项目中需要实现真实爬取逻辑
const MOCK_TOPICS: HotTopic[] = [
  { id: '1', word: '周杰伦新歌发布', hotValue: 12345678, rank: 1, link: 'https://www.douyin.com/discover?keyword=周杰伦新歌发布', fetchedAt: new Date().toISOString() },
  { id: '2', word: '春节档电影推荐', hotValue: 9876543, rank: 2, link: 'https://www.douyin.com/discover?keyword=春节档电影推荐', fetchedAt: new Date().toISOString() },
  { id: '3', word: '2024科技趋势', hotValue: 7654321, rank: 3, link: 'https://www.douyin.com/discover?keyword=2024科技趋势', fetchedAt: new Date().toISOString() },
  { id: '4', word: 'ai写作技巧', hotValue: 5432109, rank: 4, link: 'https://www.douyin.com/discover?keyword=ai写作技巧', fetchedAt: new Date().toISOString() },
  { id: '5', word: '职场干货分享', hotValue: 4321098, rank: 5, link: 'https://www.douyin.com/discover?keyword=职场干货分享', fetchedAt: new Date().toISOString() },
];

const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: '这视频太牛了！一定要看',
    author: { id: 'c1', nickname: '科技小达人', avatar: 'https://example.com/avatar1.jpg', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
    likes: 123456,
    comments: 8901,
    shares: 2345,
    coverUrl: 'https://example.com/cover1.jpg',
    fetchedAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    title: '教你三招提升效率',
    author: { id: 'c2', nickname: '效率达人', avatar: 'https://example.com/avatar2.jpg', followers: 987654, verified: false, fetchedAt: new Date().toISOString() },
    likes: 98765,
    comments: 4321,
    shares: 1234,
    coverUrl: 'https://example.com/cover2.jpg',
    fetchedAt: new Date().toISOString(),
  },
];

const MOCK_CREATORS: Creator[] = [
  { id: 'c1', nickname: '科技小达人', avatar: 'https://example.com/avatar1.jpg', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
  { id: 'c2', nickname: '效率达人', avatar: 'https://example.com/avatar2.jpg', followers: 987654, verified: false, fetchedAt: new Date().toISOString() },
  { id: 'c3', nickname: '美食博主小王', avatar: 'https://example.com/avatar3.jpg', followers: 876543, verified: true, fetchedAt: new Date().toISOString() },
];

export const douyinService = {
  // 获取热搜话题
  async fetchHotTopics(): Promise<HotTopic[]> {
    // TODO: 实现真实爬取逻辑
    // 目前返回模拟数据
    return MOCK_TOPICS;
  },

  // 获取热门视频
  async fetchHotVideos(): Promise<Video[]> {
    // TODO: 实现真实爬取逻辑
    return MOCK_VIDEOS;
  },

  // 获取热门创作者
  async fetchHotCreators(): Promise<Creator[]> {
    // TODO: 实现真实爬取逻辑
    return MOCK_CREATORS;
  },

  // 刷新所有数据
  async refreshAll() {
    const [topics, videos, creators] = await Promise.all([
      this.fetchHotTopics(),
      this.fetchHotVideos(),
      this.fetchHotCreators(),
    ]);

    storage.saveTopics(topics);
    storage.saveVideos(videos);
    storage.saveCreators(creators);

    return { topics, videos, creators };
  },
};
```

- [ ] **Step 3: 测试数据服务**

Run: `cd server && npm run dev`
Expected: 服务启动成功

Run: `curl http://localhost:4000/api/hot/topics`
Expected: 返回热搜话题列表

- [ ] **Step 4: 提交代码**

```bash
git add -A
git commit -m "feat: add Douyin data service with mock data"
```

---

### Task 4: API 路由

**Files:**
- Create: `server/src/routes/hot.ts`
- Create: `server/src/routes/docs.ts`
- Modify: `server/src/index.ts` (导入路由)

**Interfaces:**
- Consumes: `douyinService`, `storage`, `markdownService`
- Produces: Express 路由处理器

- [ ] **Step 1: 创建热点 API 路由**

```typescript
// server/src/routes/hot.ts
import { Router } from 'express';
import { douyinService } from '../services/douyin.js';
import { storage } from '../services/storage.js';
import { ApiResponse, HotTopic, Video, Creator } from '../types/index.js';

const router = Router();

// 获取热搜话题
router.get('/topics', (_, res) => {
  try {
    const topics = storage.getTopics();
    const response: ApiResponse<HotTopic[]> = {
      success: true,
      data: topics,
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

// 获取热门视频
router.get('/videos', (_, res) => {
  try {
    const videos = storage.getVideos();
    const response: ApiResponse<Video[]> = {
      success: true,
      data: videos,
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

// 获取热门创作者
router.get('/creators', (_, res) => {
  try {
    const creators = storage.getCreators();
    const response: ApiResponse<Creator[]> = {
      success: true,
      data: creators,
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

// 刷新热点数据
router.post('/refresh', async (_, res) => {
  try {
    const result = await douyinService.refreshAll();
    const response: ApiResponse<{ topics: number; videos: number; creators: number }> = {
      success: true,
      data: {
        topics: result.topics.length,
        videos: result.videos.length,
        creators: result.creators.length,
      },
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

export default router;
```

- [ ] **Step 2: 创建文档 API 路由**

```typescript
// server/src/routes/docs.ts
import { Router } from 'express';
import { storage } from '../services/storage.js';
import { markdownService } from '../services/markdown.js';
import { ApiResponse } from '../types/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../../../docs/generated');

const router = Router();

// 确保 docs 目录存在
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// 获取今日 Markdown 文档
router.get('/today', (_, res) => {
  try {
    const topics = storage.getTopics();
    const videos = storage.getVideos();
    const creators = storage.getCreators();

    const markdown = markdownService.generateDailyReport(topics, videos, creators);

    const response: ApiResponse<{ content: string; filename: string }> = {
      success: true,
      data: {
        content: markdown,
        filename: `douyin-hotspot-${new Date().toISOString().split('T')[0]}.md`,
      },
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

// 导出 Markdown 文件
router.get('/export', (_, res) => {
  try {
    const topics = storage.getTopics();
    const videos = storage.getVideos();
    const creators = storage.getCreators();

    const markdown = markdownService.generateDailyReport(topics, videos, creators);
    const filename = `douyin-hotspot-${new Date().toISOString().split('T')[0]}.md`;

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(markdown);
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 获取历史文档列表
router.get('/list', (_, res) => {
  try {
    const files = fs.readdirSync(docsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: `/docs/generated/${f}`,
        date: f.replace('douyin-hotspot-', '').replace('.md', ''),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    const response: ApiResponse<typeof files> = {
      success: true,
      data: files,
      error: null,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.json(response);
  }
});

export default router;
```

- [ ] **Step 3: 更新入口文件导入路由**

```typescript
// server/src/index.ts (更新后)
import express from 'express';
import cors from 'cors';
import hotRouter from './routes/hot.js';
import docsRouter from './routes/docs.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/hot', hotRouter);
app.use('/api/docs', docsRouter);

app.get('/api/health', (_, res) => {
  res.json({ success: true, data: { status: 'ok' }, error: null });
});

// 提供静态文件（前端构建产物）
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: 测试 API 路由**

Run: `curl http://localhost:4000/api/hot/topics`
Expected: 返回热搜话题 JSON

Run: `curl http://localhost:4000/api/docs/today`
Expected: 返回 Markdown 内容

- [ ] **Step 5: 提交代码**

```bash
git add -A
git commit -m "feat: add API routes for hot topics and docs"
```

---

### Task 5: Markdown 生成服务

**Files:**
- Create: `server/src/services/markdown.ts`

**Interfaces:**
- Consumes: `HotTopic[]`, `Video[]`, `Creator[]`
- Produces: `markdownService.generateDailyReport()` 返回格式化的 Markdown 字符串

- [ ] **Step 1: 创建 Markdown 生成服务**

```typescript
// server/src/services/markdown.ts
import { HotTopic, Video, Creator } from '../types/index.js';
import { formatNumber, formatDateTime } from '../utils/format.js';

export const markdownService = {
  generateDailyReport(topics: HotTopic[], videos: Video[], creators: Creator[]): string {
    const now = formatDateTime();

    let md = `# 抖音热点日报 - ${new Date().toISOString().split('T')[0]}\n\n`;

    // 数据概览
    md += `## 📊 数据概览\n`;
    md += `- 热搜话题: ${topics.length} 条\n`;
    md += `- 热门视频: ${videos.length} 个\n`;
    md += `- 热门创作者: ${creators.length} 位\n`;
    md += `- 更新时间: ${now}\n\n`;
    md += `---\n\n`;

    // 热搜话题
    md += `## 🔥 热搜话题 TOP 10\n\n`;
    md += `| 排名 | 话题 | 热度值 |\n`;
    md += `|:---:|------|-------:|\n`;
    const topTopics = topics.slice(0, 10);
    for (const t of topTopics) {
      md += `| ${t.rank} | ${t.word} | ${formatNumber(t.hotValue)} |\n`;
    }
    md += `\n---\n\n`;

    // 热门视频
    md += `## 🎬 热门视频\n\n`;
    for (let i = 0; i < Math.min(videos.length, 10); i++) {
      const v = videos[i];
      md += `### ${i + 1}. ${v.title}\n\n`;
      md += `- **作者**: @${v.author?.nickname || '未知'}\n`;
      md += `- **点赞**: ${formatNumber(v.likes)} | **评论**: ${formatNumber(v.comments)} | **分享**: ${formatNumber(v.shares)}\n`;
      md += `- **链接**: https://www.douyin.com/video/${v.id}\n\n`;
    }
    md += `---\n\n`;

    // 热门创作者
    md += `## 👤 热门创作者\n\n`;
    md += `| 排名 | 创作者 | 粉丝数 | 认证 |\n`;
    md += `|:---:|--------|-------:|:---:|\n`;
    const topCreators = creators.slice(0, 10);
    for (let i = 0; i < topCreators.length; i++) {
      const c = topCreators[i];
      md += `| ${i + 1} | @${c.nickname} | ${formatNumber(c.followers)} | ${c.verified ? '✅' : '❌'} |\n`;
    }
    md += `\n---\n\n`;

    md += `*由 Douyin Hot Spot Analyzer 自动生成*\n`;

    return md;
  },
};
```

- [ ] **Step 2: 测试 Markdown 生成**

Run: `curl http://localhost:4000/api/docs/today | jq .data.content`
Expected: 返回格式化的 Markdown

- [ ] **Step 3: 提交代码**

```bash
git add -A
git commit -m "feat: add Markdown generation service"
```

---

### Task 6: 前端 - API 客户端和 Hooks

**Files:**
- Create: `client/src/api/client.ts`
- Create: `client/src/hooks/useHotData.ts`
- Create: `client/src/types/index.ts`

**Interfaces:**
- Produces: `apiClient` 对象，`useHotData` hook

- [ ] **Step 1: 创建 API 客户端**

```typescript
// client/src/api/client.ts
import axios, { AxiosResponse } from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export const apiClient = {
  async getHotTopics(): Promise<ApiResponse<any[]>> {
    const res = await client.get<ApiResponse<any[]>>('/hot/topics');
    return res.data;
  },

  async getHotVideos(): Promise<ApiResponse<any[]>> {
    const res = await client.get<ApiResponse<any[]>>('/hot/videos');
    return res.data;
  },

  async getHotCreators(): Promise<ApiResponse<any[]>> {
    const res = await client.get<ApiResponse<any[]>>('/hot/creators');
    return res.data;
  },

  async refreshHotData(): Promise<ApiResponse<{ topics: number; videos: number; creators: number }>> {
    const res = await client.post<ApiResponse<any>>('/hot/refresh');
    return res.data;
  },

  async getTodayDoc(): Promise<ApiResponse<{ content: string; filename: string }>> {
    const res = await client.get<ApiResponse<any>>('/docs/today');
    return res.data;
  },
};
```

- [ ] **Step 2: 创建自定义 Hook**

```typescript
// client/src/hooks/useHotData.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export function useHotData() {
  const [topics, setTopics] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [topicsRes, videosRes, creatorsRes] = await Promise.all([
        apiClient.getHotTopics(),
        apiClient.getHotVideos(),
        apiClient.getHotCreators(),
      ]);

      if (topicsRes.success) setTopics(topicsRes.data || []);
      if (videosRes.success) setVideos(videosRes.data || []);
      if (creatorsRes.success) setCreators(creatorsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await apiClient.refreshHotData();
      if (res.success) {
        await fetchData();
      } else {
        setError(res.error || 'Failed to refresh');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { topics, videos, creators, loading, error, refreshing, refresh, fetchData };
}
```

- [ ] **Step 3: 创建前端类型定义**

```typescript
// client/src/types/index.ts
export interface HotTopic {
  id: string;
  word: string;
  hotValue: number;
  rank: number;
  link: string;
  fetchedAt: string;
}

export interface Video {
  id: string;
  title: string;
  author: Creator;
  likes: number;
  comments: number;
  shares: number;
  coverUrl: string;
  fetchedAt: string;
}

export interface Creator {
  id: string;
  nickname: string;
  avatar: string;
  followers: number;
  verified: boolean;
  fetchedAt: string;
}
```

- [ ] **Step 4: 提交代码**

```bash
git add -A
git commit -m "feat: add frontend API client and hooks"
```

---

### Task 7: 前端 - 核心组件

**Files:**
- Create: `client/src/components/HotTopicCard.tsx`
- Create: `client/src/components/VideoCard.tsx`
- Create: `client/src/components/CreatorCard.tsx`
- Create: `client/src/components/RefreshButton.tsx`
- Create: `client/src/components/MarkdownPreview.tsx`

**Interfaces:**
- Produces: 可复用的 React 组件

- [ ] **Step 1: 创建 HotTopicCard 组件**

```typescript
// client/src/components/HotTopicCard.tsx
import React from 'react';

interface Props {
  rank: number;
  word: string;
  hotValue: number;
  link?: string;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toString();
}

export function HotTopicCard({ rank, word, hotValue, link }: Props) {
  return (
    <a
      href={link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
          rank <= 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{word}</p>
          <p className="text-sm text-gray-500">{formatNumber(hotValue)}</p>
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: 创建 VideoCard 组件**

```typescript
// client/src/components/VideoCard.tsx
import React from 'react';

interface Props {
  title: string;
  authorNickname: string;
  likes: number;
  comments: number;
  coverUrl?: string;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toString();
}

export function VideoCard({ title, authorNickname, likes, comments, coverUrl }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      {coverUrl && (
        <div className="aspect-video bg-gray-100">
          <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">@{authorNickname}</p>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>❤️ {formatNumber(likes)}</span>
          <span>💬 {formatNumber(comments)}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 CreatorCard 组件**

```typescript
// client/src/components/CreatorCard.tsx
import React from 'react';

interface Props {
  nickname: string;
  avatar?: string;
  followers: number;
  verified: boolean;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toString();
}

export function CreatorCard({ nickname, avatar, followers, verified }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={nickname} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
            👤
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="font-medium text-gray-900 truncate">{nickname}</p>
          {verified && <span className="text-blue-500">✅</span>}
        </div>
        <p className="text-sm text-gray-500">粉丝 {formatNumber(followers)}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 RefreshButton 组件**

```typescript
// client/src/components/RefreshButton.tsx
import React from 'react';

interface Props {
  onRefresh: () => void;
  loading: boolean;
}

export function RefreshButton({ onRefresh, loading }: Props) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        loading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          刷新中...
        </span>
      ) : (
        '🔄 刷新数据'
      )}
    </button>
  );
}
```

- [ ] **Step 5: 创建 MarkdownPreview 组件**

```typescript
// client/src/components/MarkdownPreview.tsx
import React, { useState } from 'react';

interface Props {
  content: string;
  filename: string;
}

export function MarkdownPreview({ content, filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">📄 {filename}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {copied ? '✅ 已复制' : '📋 复制'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            ⬇️ 下载
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-700 whitespace-pre-wrap font-mono">
        {content}
      </pre>
    </div>
  );
}
```

- [ ] **Step 6: 提交代码**

```bash
git add -A
git commit -m "feat: add frontend core components"
```

---

### Task 8: 前端 - 页面

**Files:**
- Create: `client/src/App.tsx`
- Create: `client/src/pages/Home.tsx`
- Create: `client/src/pages/Docs.tsx`
- Create: `client/src/pages/Settings.tsx`
- Create: `client/tailwind.config.js`
- Create: `client/postcss.config.js`

**Interfaces:**
- Produces: 完整的 SPA 应用

- [ ] **Step 1: 创建 Tailwind 配置**

```javascript
// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```javascript
// client/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 2: 创建 Home 页面**

```typescript
// client/src/pages/Home.tsx
import React from 'react';
import { useHotData } from '../hooks/useHotData';
import { HotTopicCard } from '../components/HotTopicCard';
import { VideoCard } from '../components/VideoCard';
import { CreatorCard } from '../components/CreatorCard';
import { RefreshButton } from '../components/RefreshButton';

export function Home() {
  const { topics, videos, creators, loading, error, refreshing, refresh } = useHotData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        加载失败: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🔥 抖音热点</h1>
        <RefreshButton onRefresh={refresh} loading={refreshing} />
      </div>

      {/* 热搜话题 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">热搜话题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.slice(0, 9).map((topic) => (
            <HotTopicCard
              key={topic.id}
              rank={topic.rank}
              word={topic.word}
              hotValue={topic.hotValue}
              link={topic.link}
            />
          ))}
        </div>
      </section>

      {/* 热门视频 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">热门视频</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              authorNickname={video.author?.nickname || '未知'}
              likes={video.likes}
              comments={video.comments}
              coverUrl={video.coverUrl}
            />
          ))}
        </div>
      </section>

      {/* 热门创作者 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">热门创作者</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              nickname={creator.nickname}
              avatar={creator.avatar}
              followers={creator.followers}
              verified={creator.verified}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: 创建 Docs 页面**

```typescript
// client/src/pages/Docs.tsx
import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { MarkdownPreview } from '../components/MarkdownPreview';

export function Docs() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await apiClient.getTodayDoc();
        if (res.success && res.data) {
          setContent(res.data.content);
          setFilename(res.data.filename);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, []);

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">📄 文档中心</h1>
      {content ? (
        <MarkdownPreview content={content} filename={filename} />
      ) : (
        <p className="text-gray-500">暂无文档</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 创建 Settings 页面**

```typescript
// client/src/pages/Settings.tsx
import React from 'react';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ 设置</h1>
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">基础设置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数据刷新频率
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="30">每 30 分钟</option>
              <option value="60">每小时</option>
              <option value="120">每 2 小时</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Markdown 导出格式
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="md">Markdown (.md)</option>
              <option value="txt">纯文本 (.txt)</option>
            </select>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            版本: 0.1.0 | Douyin Hot Spot Analyzer
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 创建 App 组件和路由**

```typescript
// client/src/App.tsx
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Docs } from './pages/Docs';
import { Settings } from './pages/Settings';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 首页', icon: '🏠' },
    { path: '/docs', label: '📄 文档', icon: '📄' },
    { path: '/settings', label: '⚙️ 设置', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
```

- [ ] **Step 6: 创建客户端类型声明文件**

```json
// client/tsconfig.node.json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: 提交代码**

```bash
git add -A
git commit -m "feat: add frontend pages and routing"
```

---

### Task 9: 项目整合和构建

**Files:**
- Modify: 根目录 `.gitignore`
- Create: `README.md`
- Create: `docs/DEVELOPMENT.md`

**验证:**
- `npm run build` 成功
- `npm run dev` 前后端同时启动

- [ ] **Step 1: 创建 .gitignore**

```
# 依赖
node_modules/
server/node_modules/
client/node_modules/

# 构建产物
server/dist/
client/dist/

# 数据库
*.db
*.db-wal
*.db-shm

# 环境变量
.env
.env.local

# IDE
.idea/
.vscode/

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
npm-debug.log*

# 文档（自动生成）
docs/generated/
```

- [ ] **Step 2: 创建 README.md**

```markdown
# Douyin Hot Spot Analyzer

抖音热点分析器 - 实时获取抖音热搜、热门视频和创作者信息，生成 Markdown 文档。

## 功能特性

- 🔥 实时获取抖音热搜话题
- 🎬 热门视频推荐
- 👤 热门创作者榜单
- 📄 自动生成 Markdown 日报
- 🌐 Web 界面浏览

## 快速开始

### 安装

```bash
npm run install:all
```

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
```

## 技术栈

- 后端: Node.js + Express + TypeScript + SQLite
- 前端: React + TypeScript + Vite + Tailwind CSS

## 项目结构

```
├── server/     # 后端服务
├── client/     # 前端应用
└── docs/       # 文档
```

## License

MIT
```

- [ ] **Step 3: 测试构建**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 4: 提交代码**

```bash
git add -A
git commit -m "feat: add build configuration and README"
```

---

### Task 10: 实现真实抖音数据获取

**Files:**
- Modify: `server/src/services/douyin.ts`

**Notes:**
- 这是可选的高级任务
- 需要处理抖音的反爬机制
- 建议使用 Puppeteer 或第三方库

- [ ] **Step 1: 调研可行的抖音数据获取方案**

Research: 查找可用的抖音 API 或爬取方案

- [ ] **Step 2: 实现真实数据获取逻辑**

Implement: 替换模拟数据为真实数据

- [ ] **Step 3: 测试并优化**

Test: 验证数据准确性和稳定性

- [ ] **Step 4: 提交代码**

```bash
git add -A
git commit -m "feat: implement real Douyin data fetching"
```

---

## 任务检查清单

| 任务 | 描述 | 状态 |
|------|------|:----:|
| Task 1 | 项目初始化 | ⬜ |
| Task 2 | 数据库和存储服务 | ⬜ |
| Task 3 | 抖音数据获取服务 | ⬜ |
| Task 4 | API 路由 | ⬜ |
| Task 5 | Markdown 生成服务 | ⬜ |
| Task 6 | 前端 API 客户端和 Hooks | ⬜ |
| Task 7 | 前端核心组件 | ⬜ |
| Task 8 | 前端页面 | ⬜ |
| Task 9 | 项目整合和构建 | ⬜ |
| Task 10 | 真实数据获取 (可选) | ⬜ |

---

## 后续维护

每次完成任务后，更新 `docs/superpowers/progress.md` 中的任务进度。
