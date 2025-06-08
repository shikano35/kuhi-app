'use client';

import { ClientHistoryChart } from './ClientHistoryChart';
import { useQuery } from '@tanstack/react-query';
import { getAllHaikuMonuments } from '@/lib/api';
import { processHistoryData } from './utils';

export function HaikuHistoryChart() {
  const {
    data: monuments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['haiku-monuments'],
    queryFn: () => getAllHaikuMonuments(),
    staleTime: 5 * 60 * 1000,
  });

  const historyData = processHistoryData(monuments);

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
        <p className="text-muted-foreground text-sm">
          {error instanceof Error
            ? error.message
            : 'データの取得に失敗しました'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ClientHistoryChart historyData={historyData} />
    </div>
  );
}
