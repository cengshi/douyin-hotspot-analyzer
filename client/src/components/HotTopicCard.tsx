interface Props {
  rank: number;
  word: string;
  hotValue: number;
  link?: string;
}

function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
}

export function HotTopicCard({ rank, word, hotValue, link }: Props) {
  return (
    <a
      href={link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
            rank <= 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{word}</p>
          <p className="text-sm text-gray-500">{formatNumber(hotValue)}</p>
        </div>
      </div>
    </a>
  );
}
