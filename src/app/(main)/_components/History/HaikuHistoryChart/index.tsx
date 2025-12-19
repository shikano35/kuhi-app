'use client';

import { ClientHistoryChart } from './ClientHistoryChart';
import { useQuery } from '@tanstack/react-query';
import {
  getAllMonuments,
  getAllMonumentsFromInscriptions,
} from '@/lib/kuhi-api';
import { processHistoryData } from './utils';
import { MonumentWithRelations } from '@/types/definitions/api';

export function HaikuHistoryChart() {
  const {
    data: monuments = [],
    isLoading,
    error,
  } = useQuery<MonumentWithRelations[]>({
    queryKey: ['kuhi-monuments-history-all'],
    queryFn: async () => {
      try {
        const monuments = await getAllMonuments();
        return monuments;
      } catch {
        const monuments = await getAllMonumentsFromInscriptions();
        return monuments;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
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
