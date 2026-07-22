import { useDoc } from '../hooks/useDoc';
import { MarkdownPreview } from '../components/MarkdownPreview';

export function Docs() {
  const { content, filename, loading, error } = useDoc();

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">📄 文档中心</h1>
      {content ? (
        <MarkdownPreview content={content} filename={filename} />
      ) : (
        <div className="p-8 bg-white rounded-lg shadow text-center text-gray-500">
          暂无文档，请先在首页刷新热点数据
        </div>
      )}
    </div>
  );
}
