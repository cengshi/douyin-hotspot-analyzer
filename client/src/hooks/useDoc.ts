import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { DocResult } from '../types';

interface UseDocReturn {
  content: string;
  filename: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDoc(): UseDocReturn {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoc = useCallback(async () => {
    try {
      setError(null);
      const res = await api.getTodayDoc();
      if (res.success && res.data) {
        setContent(res.data.content);
        setFilename(res.data.filename);
      } else {
        setError(res.error || '获取文档失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取文档失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  return { content, filename, loading, error, refresh: fetchDoc };
}
