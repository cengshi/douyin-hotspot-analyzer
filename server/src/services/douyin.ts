import { HotTopic, Video, Creator } from '../types/index.js';

// 模拟数据 - 实际项目中需要实现真实爬取逻辑
const MOCK_TOPICS: HotTopic[] = [
  { id: '1', word: '周杰伦新歌发布', hotValue: 12345678, rank: 1, link: 'https://www.douyin.com/discover?keyword=周杰伦新歌发布', fetchedAt: new Date().toISOString() },
  { id: '2', word: '春节档电影推荐', hotValue: 9876543, rank: 2, link: 'https://www.douyin.com/discover?keyword=春节档电影推荐', fetchedAt: new Date().toISOString() },
  { id: '3', word: '2026科技趋势', hotValue: 7654321, rank: 3, link: 'https://www.douyin.com/discover?keyword=2026科技趋势', fetchedAt: new Date().toISOString() },
  { id: '4', word: 'AI写作技巧', hotValue: 5432109, rank: 4, link: 'https://www.douyin.com/discover?keyword=AI写作技巧', fetchedAt: new Date().toISOString() },
  { id: '5', word: '职场干货分享', hotValue: 4321098, rank: 5, link: 'https://www.douyin.com/discover?keyword=职场干货分享', fetchedAt: new Date().toISOString() },
  { id: '6', word: '减肥食谱大公开', hotValue: 3210987, rank: 6, link: 'https://www.douyin.com/discover?keyword=减肥食谱', fetchedAt: new Date().toISOString() },
  { id: '7', word: '猫咪搞笑合集', hotValue: 2109876, rank: 7, link: 'https://www.douyin.com/discover?keyword=猫咪搞笑', fetchedAt: new Date().toISOString() },
  { id: '8', word: '旅游打卡圣地', hotValue: 1987654, rank: 8, link: 'https://www.douyin.com/discover?keyword=旅游打卡', fetchedAt: new Date().toISOString() },
  { id: '9', word: '理财入门教程', hotValue: 1765432, rank: 9, link: 'https://www.douyin.com/discover?keyword=理财入门', fetchedAt: new Date().toISOString() },
  { id: '10', word: '手工DIY教程', hotValue: 1543210, rank: 10, link: 'https://www.douyin.com/discover?keyword=手工DIY', fetchedAt: new Date().toISOString() },
];

const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: '这视频太牛了！一定要看完全程',
    author: { id: 'c1', nickname: '科技小达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
    likes: 123456,
    comments: 8901,
    shares: 2345,
    coverUrl: 'https://picsum.photos/seed/v1/400/300',
    fetchedAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    title: '教你三招提升效率，工作事半功倍',
    author: { id: 'c2', nickname: '效率达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', followers: 987654, verified: false, fetchedAt: new Date().toISOString() },
    likes: 98765,
    comments: 4321,
    shares: 1234,
    coverUrl: 'https://picsum.photos/seed/v2/400/300',
    fetchedAt: new Date().toISOString(),
  },
  {
    id: 'v3',
    title: '家常菜做法大全，学会了你就是大厨',
    author: { id: 'c3', nickname: '美食博主小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', followers: 876543, verified: true, fetchedAt: new Date().toISOString() },
    likes: 87654,
    comments: 3210,
    shares: 987,
    coverUrl: 'https://picsum.photos/seed/v3/400/300',
    fetchedAt: new Date().toISOString(),
  },
  {
    id: 'v4',
    title: '健身30天对比图，效果太明显了',
    author: { id: 'c4', nickname: '健身教练老李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4', followers: 765432, verified: true, fetchedAt: new Date().toISOString() },
    likes: 76543,
    comments: 2109,
    shares: 876,
    coverUrl: 'https://picsum.photos/seed/v4/400/300',
    fetchedAt: new Date().toISOString(),
  },
  {
    id: 'v5',
    title: '萌宠日常，看着心情都好起来了',
    author: { id: 'c5', nickname: '铲屎官日记', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c5', followers: 654321, verified: false, fetchedAt: new Date().toISOString() },
    likes: 65432,
    comments: 1987,
    shares: 765,
    coverUrl: 'https://picsum.photos/seed/v5/400/300',
    fetchedAt: new Date().toISOString(),
  },
];

const MOCK_CREATORS: Creator[] = [
  { id: 'c1', nickname: '科技小达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1', followers: 1234567, verified: true, fetchedAt: new Date().toISOString() },
  { id: 'c2', nickname: '效率达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2', followers: 987654, verified: false, fetchedAt: new Date().toISOString() },
  { id: 'c3', nickname: '美食博主小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3', followers: 876543, verified: true, fetchedAt: new Date().toISOString() },
  { id: 'c4', nickname: '健身教练老李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4', followers: 765432, verified: true, fetchedAt: new Date().toISOString() },
  { id: 'c5', nickname: '铲屎官日记', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c5', followers: 654321, verified: false, fetchedAt: new Date().toISOString() },
  { id: 'c6', nickname: '旅行家小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c6', followers: 543210, verified: true, fetchedAt: new Date().toISOString() },
  { id: 'c7', nickname: '手工达人阿杰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c7', followers: 432109, verified: false, fetchedAt: new Date().toISOString() },
  { id: 'c8', nickname: '财经分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c8', followers: 321098, verified: true, fetchedAt: new Date().toISOString() },
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

    return { topics, videos, creators };
  },
};
