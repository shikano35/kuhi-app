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
      <div className="w-full max-w-4xl mx-auto">
        <div className="w-full animate-pulse">
          <div className="flex justify-end mb-4">
            <div className="inline-flex gap-px">
              <div className="h-9.5 w-20 bg-muted rounded-l-md" />
              <div className="h-9.5 w-20 bg-muted rounded-r-md" />
            </div>
          </div>
          <div className="w-full h-[400px] bg-muted/30 rounded-md" />
        </div>
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
