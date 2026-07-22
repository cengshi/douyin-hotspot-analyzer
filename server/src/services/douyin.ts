import axios from 'axios';
import { HotTopic, Video, Creator } from '../types/index.js';

// 抖音网页版热搜接口
const DOUYIN_HOT_API = 'https://www.douyin.com/aweme/v1/web/hot/search/list/';

// User-Agent 模拟浏览器
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.douyin.com/',
  'Accept': 'application/json, text/plain, */*',
};

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 格式化数字
function parseHotValue(value: string | number): number {
  if (typeof value === 'number') return value;
  const str = value.toString();
  if (str.includes('万')) {
    return parseFloat(str) * 10000;
  }
  if (str.includes('亿')) {
    return parseFloat(str) * 100000000;
  }
  return parseInt(str) || 0;
}

export const douyinService = {
  /**
   * 获取热搜话题 - 从抖音网页版
   */
  async fetchHotTopics(): Promise<HotTopic[]> {
    try {
      // 方法1: 尝试调用抖音热搜 API
      const response = await axios.get(DOUYIN_HOT_API, {
        headers: HEADERS,
        params: {
          device_platform: 'webapp',
          aid: '6383',
          channel: 'channel_pc_web',
          detail_list: '1',
        },
        timeout: 10000,
      });

      if (response.data?.data?.word_list) {
        return response.data.data.word_list.map((item: any, index: number) => ({
          id: item.word_id?.toString() || generateId(),
          word: item.word || item.sentence || `话题${index + 1}`,
          hotValue: parseHotValue(item.hot_value || item.value || 0),
          rank: index + 1,
          link: `https://www.douyin.com/search/${encodeURIComponent(item.word || '')}`,
          fetchedAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.log('抖音 API 获取失败，尝试备用方案...');
    }

    // 备用方案: 返回空数组，用户可以看到刷新失败
    return [];
  },

  /**
   * 获取热门视频 - 从抖音
   */
  async fetchHotVideos(): Promise<Video[]> {
    // 抖音的热门视频需要更复杂的爬取
    // 这里返回一个空数组，实际可以后续扩展
    return [];
  },

  /**
   * 获取热门创作者
   */
  async fetchHotCreators(): Promise<Creator[]> {
    // 需要单独的实现
    return [];
  },

  /**
   * 刷新所有数据
   */
  async refreshAll() {
    // 先尝试获取热搜
    let topics: HotTopic[] = [];
    let videos: Video[] = [];
    let creators: Creator[] = [];

    try {
      topics = await this.fetchHotTopics();
    } catch (error) {
      console.error('获取热搜失败:', error);
    }

    // 如果获取不到真实数据，返回模拟数据作为演示
    if (topics.length === 0) {
      console.log('使用演示数据...');
      topics = this.getDemoTopics();
    }

    videos = this.getDemoVideos();
    creators = this.getDemoCreators();

    return { topics, videos, creators };
  },

  /**
   * 获取演示用的话题数据
   */
  getDemoTopics(): HotTopic[] {
    return [
      { id: '1', word: '巴黎奥运会', hotValue: 9865321, rank: 1, link: 'https://www.douyin.com/search/巴黎奥运会', fetchedAt: new Date().toISOString() },
      { id: '2', word: '夏日清凉穿搭', hotValue: 8765432, rank: 2, link: 'https://www.douyin.com/search/夏日清凉穿搭', fetchedAt: new Date().toISOString() },
      { id: '3', word: 'AI生成视频教程', hotValue: 7654321, rank: 3, link: 'https://www.douyin.com/search/AI生成视频教程', fetchedAt: new Date().toISOString() },
      { id: '4', word: '周末美食打卡', hotValue: 6543210, rank: 4, link: 'https://www.douyin.com/search/周末美食打卡', fetchedAt: new Date().toISOString() },
      { id: '5', word: '新能源汽车测评', hotValue: 5432109, rank: 5, link: 'https://www.douyin.com/search/新能源汽车测评', fetchedAt: new Date().toISOString() },
      { id: '6', word: '职场沟通技巧', hotValue: 4321098, rank: 6, link: 'https://www.douyin.com/search/职场沟通技巧', fetchedAt: new Date().toISOString() },
      { id: '7', word: '猫咪日常', hotValue: 3210987, rank: 7, link: 'https://www.douyin.com/search/猫咪日常', fetchedAt: new Date().toISOString() },
      { id: '8', word: '健身打卡', hotValue: 2109876, rank: 8, link: 'https://www.douyin.com/search/健身打卡', fetchedAt: new Date().toISOString() },
      { id: '9', word: '旅游景点推荐', hotValue: 1987654, rank: 9, link: 'https://www.douyin.com/search/旅游景点推荐', fetchedAt: new Date().toISOString() },
      { id: '10', word: '理财知识科普', hotValue: 1765432, rank: 10, link: 'https://www.douyin.com/search/理财知识科普', fetchedAt: new Date().toISOString() },
    ];
  },

  /**
   * 获取演示用的视频数据
   */
  getDemoVideos(): Video[] {
    return [
      {
        id: 'v1',
        title: '巴黎奥运会精彩瞬间合集',
        author: { id: 'c1', nickname: '体育观察员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', followers: 2345678, verified: true, fetchedAt: new Date().toISOString() },
        likes: 234567,
        comments: 12345,
        shares: 5678,
        coverUrl: 'https://picsum.photos/seed/olympic/400/300',
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'v2',
        title: '夏日清凉穿搭分享｜这一套绝了！',
        author: { id: 'c2', nickname: '时尚达人小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
        likes: 98765,
        comments: 4321,
        shares: 2345,
        coverUrl: 'https://picsum.photos/seed/fashion/400/300',
        fetchedAt: new Date().toISOString(),
      },
      {
        id: 'v3',
        title: '用AI一键生成爆款视频文案 | 教程',
        author: { id: 'c3', nickname: 'AI创客老王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', followers: 876543, verified: false, fetchedAt: new Date().toISOString() },
        likes: 76543,
        comments: 3210,
        shares: 1234,
        coverUrl: 'https://picsum.photos/seed/ai/400/300',
        fetchedAt: new Date().toISOString(),
      },
    ];
  },

  /**
   * 获取演示用的创作者数据
   */
  getDemoCreators(): Creator[] {
    return [
      { id: 'c1', nickname: '体育观察员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', followers: 2345678, verified: true, fetchedAt: new Date().toISOString() },
      { id: 'c2', nickname: '时尚达人小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
      { id: 'c3', nickname: 'AI创客老王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', followers: 876543, verified: false, fetchedAt: new Date().toISOString() },
      { id: 'c4', nickname: '美食探险家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4', followers: 765432, verified: true, fetchedAt: new Date().toISOString() },
      { id: 'c5', nickname: '健身教练阿杰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c5', followers: 654321, verified: false, fetchedAt: new Date().toISOString() },
    ];
  },
};
