'use client';

import { useEffect, useState } from 'react';
import { ClientHistoryChart } from './ClientHistoryChart';
import { getAllHaikuMonuments } from '@/lib/api';
import { processHistoryData, type HistoryDataPoint } from './utils';

export function HaikuHistoryChart() {
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const monuments = await getAllHaikuMonuments();
        const processedData = processHistoryData(monuments);
        setHistoryData(processedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'データの取得に失敗しました'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center">
        <p className="text-red-500 mb-2">エラーが発生しました</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ClientHistoryChart historyData={historyData} />
    </div>
  );
}
