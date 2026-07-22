import { useState } from 'react';
import { api } from '../api/client';

interface Props {
  content: string;
  filename: string;
}

export function MarkdownPreview({ content, filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">📄 {filename}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {copied ? '✅ 已复制' : '📋 复制'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            ⬇️ 下载
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
        {content}
      </pre>
    </div>
  );
}
