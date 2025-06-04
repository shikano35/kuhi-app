'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { Button } from '@/components/ui/button';
import { HaikuMonument } from '@/types/haiku';

type RegionalHaikuClientComponentProps = {
  regionMonumentsMap: Record<string, HaikuMonument[]>;
  regions: string[];
  initialMonuments: HaikuMonument[];
};

export function RegionalHaikuClientComponent({
  regionMonumentsMap,
  regions,
  initialMonuments,
}: RegionalHaikuClientComponentProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const displayMonuments = activeRegion
    ? regionMonumentsMap[activeRegion] || []
    : initialMonuments;

  const handleRegionClick = (region: string) => {
    if (activeRegion === region) {
      setActiveRegion(null);
    } else {
      setActiveRegion(region);
    }
  };

  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl mb-8 text-center text-primary">
          地域で探す
        </h2>

        <div
          aria-label="地域フィルタ"
          className="flex flex-wrap justify-center mb-8 gap-2"
          role="tablist"
        >
          {regions.map((region) => (
            <button
              aria-label={`${region}の句碑を表示`}
              aria-selected={activeRegion === region}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeRegion === region
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-input'
              }`}
              key={region}
              onClick={() => handleRegionClick(region)}
              role="tab"
            >
              {region}
            </button>
          ))}
        </div>

        {displayMonuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {activeRegion
                ? 'この地域の句碑データはまだありません。'
                : '地域を選択すると句碑が表示されます。'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMonuments.map((monument) => (
              <HaikuCard key={monument.id} monument={monument} />
            ))}
          </div>
        )}

        {displayMonuments.length >= 6 && (
          <div className="text-center mt-8">
            <Button asChild className="rounded-full px-8 py-6 text-base">
              <Link
                href={activeRegion ? `/list?region=${activeRegion}` : '/list'}
              >
                もっと見る
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
