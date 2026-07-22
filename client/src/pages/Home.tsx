import { useState, useEffect } from 'react';
import { useHotData } from '../hooks/useHotData';
import { HotTopicCard } from '../components/HotTopicCard';
import { VideoCard } from '../components/VideoCard';
import { CreatorCard } from '../components/CreatorCard';
import { RefreshButton } from '../components/RefreshButton';
import { LastUpdated } from '../components/LastUpdated';
import { api } from '../api/client';

export function Home() {
  const { topics, videos, creators, loading, error, refreshing, refresh, lastUpdated } = useHotData();
  const [schedulerRunning, setSchedulerRunning] = useState(false);

  useEffect(() => {
    loadSchedulerStatus();
  }, []);

  const loadSchedulerStatus = async () => {
    try {
      const res = await api.getSchedulerStatus();
      if (res.success && res.data) {
        setSchedulerRunning(res.data.running);
      }
    } catch (error) {
      console.error('获取定时任务状态失败:', error);
    }
  };

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔥 抖音热点</h1>
          <div className="flex items-center gap-4 mt-1">
            <LastUpdated lastUpdated={lastUpdated} />
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              schedulerRunning
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {schedulerRunning ? '⏰ 定时刷新中' : '⏸️ 定时刷新已停止'}
            </span>
          </div>
        </div>
        <RefreshButton onRefresh={refresh} loading={refreshing} />
      </div>

      {/* 热搜话题 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">热搜话题 TOP 50</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
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
      {videos.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">热门视频</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                authorNickname={video.author?.nickname || '未知'}
                authorAvatar={video.author?.avatar}
                likes={video.likes}
                comments={video.comments}
                coverUrl={video.coverUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* 热门创作者 */}
      {creators.length > 0 && (
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
      )}
    </div>
  );
}
