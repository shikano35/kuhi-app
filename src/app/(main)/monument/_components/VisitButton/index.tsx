'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Star, Loader2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserVisits, useAddVisit, useRemoveVisit } from '@/lib/api-hooks';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type VisitButtonProps = {
  monumentId: number;
};

export function VisitButton({ monumentId }: VisitButtonProps) {
  const { data: session } = useSession();
  const { data: visitsData } = useUserVisits();
  const addVisitMutation = useAddVisit();
  const removeVisitMutation = useRemoveVisit();

  const visitData =
    visitsData?.visits?.find((visit) => visit.monumentId === monumentId) ??
    null;
  const isVisited = !!visitData;

  const isLoading = addVisitMutation.isPending || removeVisitMutation.isPending;

  const handleVisitToggle = async () => {
    if (!session?.user || isLoading) return;

    if (isVisited) {
      await removeVisitMutation.mutateAsync(monumentId);
    } else {
      await addVisitMutation.mutateAsync({
        monumentId,
        visitedAt: new Date(),
      });
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <MapPin className="mr-2 mt-0.25  text-primary size-5" />
        訪問記録
      </h3>

      {isVisited && visitData ? (
        <div className="space-y-3">
          <div className="flex items-center text-green-600">
            <Calendar className="mr-2 mt-0.25  size-4" />
            <span className="text-sm">
              {format(new Date(visitData.visitedAt), 'yyyy年M月d日', {
                locale: ja,
              })}{' '}
              に訪問済み
            </span>
          </div>

          {visitData.rating && (
            <div className="flex items-center">
              <Star className="mr-2 mt-0.25  size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">評価: {visitData.rating}/5</span>
            </div>
          )}

          {visitData.notes && (
            <div className="bg-muted/50 p-3 rounded text-sm">
              <p className="text-muted-foreground font-medium mb-1">メモ:</p>
              <p>{visitData.notes}</p>
            </div>
          )}

          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleVisitToggle}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 mt-0.25  h-4 w-4 animate-spin" />
                解除中...
              </>
            ) : (
              <>
                <X className="mr-2 mt-0.25  h-4 w-4" />
                訪問記録を削除
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            この句碑を訪問済みとして記録できます
          </p>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleVisitToggle}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 mt-0.25  h-4 w-4 animate-spin" />
                記録中...
              </>
            ) : (
              <>
                <MapPin className="mr-2 mt-0.25  h-4 w-4" />
                訪問済みにする
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
