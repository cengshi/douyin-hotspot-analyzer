import { useHotData } from '../hooks/useHotData';
import { HotTopicCard } from '../components/HotTopicCard';
import { VideoCard } from '../components/VideoCard';
import { CreatorCard } from '../components/CreatorCard';
import { RefreshButton } from '../components/RefreshButton';
import { LastUpdated } from '../components/LastUpdated';

export function Home() {
  const { topics, videos, creators, loading, error, refreshing, refresh, lastUpdated } = useHotData();

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
          <LastUpdated lastUpdated={lastUpdated} />
        </div>
        <RefreshButton onRefresh={refresh} loading={refreshing} />
      </div>

      {/* 热搜话题 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">热搜话题</h2>
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
