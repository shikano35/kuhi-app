'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { Loader2, X, MapPin } from 'lucide-react';
import { HaikuMonument } from '@/types/definitions/haiku';

interface VisitedTabContentProps {
  visited: HaikuMonument[];
  loading: boolean;
  isRemoving: boolean;
  onRemoveVisit: (monumentId: number) => void;
}

export const VisitedTabContent = memo<VisitedTabContentProps>(
  function VisitedTabContent({ visited, loading, isRemoving, onRemoveVisit }) {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      );
    }

    if (visited.length === 0) {
      return (
        <div className="py-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">訪問記録がありません</h3>
          <p className="text-muted-foreground mb-6">
            訪れた句碑を記録して、あなたの句碑めぐりの思い出を残しましょう
          </p>
          <Button asChild>
            <Link href="/map">地図で句碑を探す</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visited.map((monument) => (
          <div className="relative" key={monument.id}>
            <HaikuCard monument={monument} showFavoriteButton={false} />
            <button
              aria-label={`${monument.inscription}を訪問記録から削除`}
              className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              disabled={isRemoving}
              onClick={() => onRemoveVisit(monument.id)}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  }
);
