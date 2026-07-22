interface Props {
  nickname: string;
  avatar?: string;
  followers: number;
  verified: boolean;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
}

export function CreatorCard({ nickname, avatar, followers, verified }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={nickname} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
            👤
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="font-medium text-gray-900 truncate">{nickname}</p>
          {verified && <span className="text-blue-500">✅</span>}
        </div>
        <p className="text-sm text-gray-500">粉丝 {formatNumber(followers)}</p>
      </div>
    </div>
  );
}
