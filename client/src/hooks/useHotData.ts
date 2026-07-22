import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { HotTopic, Video, Creator } from '../types';

interface UseHotDataReturn {
  topics: HotTopic[];
  videos: Video[];
  creators: Creator[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  lastUpdated: string | null;
}

export function useHotData(): UseHotDataReturn {
  const [topics, setTopics] = useState<HotTopic[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      const [topicsRes, videosRes, creatorsRes] = await Promise.all([
        api.getHotTopics(),
        api.getHotVideos(),
        api.getHotCreators(),
      ]);

      if (topicsRes.success) setTopics(topicsRes.data || []);
      if (videosRes.success) setVideos(videosRes.data || []);
      if (creatorsRes.success) setCreators(creatorsRes.data || []);

      // 获取最后更新时间
      if (topicsRes.data && topicsRes.data.length > 0) {
        setLastUpdated(topicsRes.data[0].fetchedAt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await api.refreshHotData();
      if (res.success) {
        await fetchData();
      } else {
        setError(res.error || '刷新失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新失败');
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { topics, videos, creators, loading, error, refreshing, refresh, lastUpdated };
}
