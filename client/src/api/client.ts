import axios from 'axios';
import type { ApiResponse, HotTopic, Video, Creator, RefreshResult, DocResult } from '../types';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const api = {
  // 获取热搜话题
  async getHotTopics(): Promise<ApiResponse<HotTopic[]>> {
    const res = await client.get<ApiResponse<HotTopic[]>>('/hot/topics');
    return res.data;
  },

  // 获取热门视频
  async getHotVideos(): Promise<ApiResponse<Video[]>> {
    const res = await client.get<ApiResponse<Video[]>>('/hot/videos');
    return res.data;
  },

  // 获取热门创作者
  async getHotCreators(): Promise<ApiResponse<Creator[]>> {
    const res = await client.get<ApiResponse<Creator[]>>('/hot/creators');
    return res.data;
  },

  // 刷新热点数据
  async refreshHotData(): Promise<ApiResponse<RefreshResult>> {
    const res = await client.post<ApiResponse<RefreshResult>>('/hot/refresh');
    return res.data;
  },

  // 获取今日文档
  async getTodayDoc(): Promise<ApiResponse<DocResult>> {
    const res = await client.get<ApiResponse<DocResult>>('/docs/today');
    return res.data;
  },

  // 导出文档
  getExportUrl(): string {
    return '/api/docs/export';
  },

  // ============ 定时任务 ============

  // 获取定时任务状态
  async getSchedulerStatus(): Promise<ApiResponse<{ running: boolean }>> {
    const res = await client.get<ApiResponse<{ running: boolean }>>('/scheduler/status');
    return res.data;
  },

  // 启动定时任务
  async startScheduler(interval?: number): Promise<ApiResponse<{ message: string }>> {
    const res = await client.post<ApiResponse<{ message: string }>>('/scheduler/start', { interval });
    return res.data;
  },

  // 停止定时任务
  async stopScheduler(): Promise<ApiResponse<{ message: string }>> {
    const res = await client.post<ApiResponse<{ message: string }>>('/scheduler/stop');
    return res.data;
  },
};
