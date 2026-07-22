// 热点数据类型

export interface HotTopic {
  id: string;
  word: string;
  hotValue: number;
  rank: number;
  link: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface RefreshResult {
  topics: number;
  videos: number;
  creators: number;
}

export interface DocResult {
  content: string;
  filename: string;
}
