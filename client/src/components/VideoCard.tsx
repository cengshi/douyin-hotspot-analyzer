interface Props {
  title: string;
  authorNickname: string;
  authorAvatar?: string;
  likes: number;
  comments: number;
  coverUrl?: string;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
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
