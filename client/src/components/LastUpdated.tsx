interface Props {
  lastUpdated: string | null;
}

export function LastUpdated({ lastUpdated }: Props) {
  if (!lastUpdated) return null;

  const date = new Date(lastUpdated);
  const formatted = date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <p className="text-sm text-gray-500">
      最后更新: {formatted}
    </p>
  );
}
