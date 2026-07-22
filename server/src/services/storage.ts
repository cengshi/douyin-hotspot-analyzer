import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HotTopic, Video, Creator } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const dataFile = path.join(dataDir, 'hotspot.json');

// 确保 data 目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据文件
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    topics: [],
    videos: [],
    creators: [],
    lastUpdated: null
  }, null, 2));
}

// 读取数据
function readData() {
  try {
    const content = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { topics: [], videos: [], creators: [], lastUpdated: null };
  }
}

// 写入数据
function writeData(data: any) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export const storage = {
  // 保存热搜话题
  saveTopics(topics: HotTopic[]) {
    const data = readData();
    data.topics = topics;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
  },

  // 获取热搜话题
  getTopics(limit = 50): HotTopic[] {
    const data = readData();
    return data.topics.slice(0, limit);
  },

  // 保存热门视频
  saveVideos(videos: Video[]) {
    const data = readData();
    data.videos = videos;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
  },

  // 获取热门视频
  getVideos(limit = 30): Video[] {
    const data = readData();
    return data.videos.slice(0, limit);
  },

  // 保存热门创作者
  saveCreators(creators: Creator[]) {
    const data = readData();
    data.creators = creators;
    data.lastUpdated = new Date().toISOString();
    writeData(data);
  },

  // 获取热门创作者
  getCreators(limit = 20): Creator[] {
    const data = readData();
    return data.creators.slice(0, limit);
  },

  // 获取最后更新时间
  getLastUpdated(): string | null {
    const data = readData();
    return data.lastUpdated;
  },

  // 获取全部数据
  getAll() {
    return readData();
  }
};
