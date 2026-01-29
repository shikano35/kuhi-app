'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { PoetCard } from '@/components/shared/PoetCard';
import { MonumentWithRelations, Poet } from '@/types/definitions/api';

interface PickupClientComponentProps {
  monuments: MonumentWithRelations[];
  poets: Poet[];
}

export function PickupClientComponent({
  monuments,
  poets,
}: PickupClientComponentProps) {
  return (
    <section className="w-full bg-linear-to-b from-muted/30 to-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                注目の句碑
              </h2>
            </div>
            <Link
              className="hidden sm:flex items-center gap-1 text-foreground hover:text-muted-foreground font-medium transition-colors"
              href="/list"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {monuments.map((monument) => (
              <HaikuCard
                key={monument.id}
                monument={monument}
                showFavoriteButton={false}
              />
            ))}
          </div>

          <Link
            className="flex sm:hidden items-center justify-center gap-1 mt-6 text-foreground hover:text-muted-foreground font-medium transition-colors"
            href="/list"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                俳人ピックアップ
              </h2>
            </div>
            <Link
              className="hidden sm:flex items-center gap-1 text-foreground hover:text-muted-foreground font-medium transition-colors"
              href="/poets"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {poets.map((poet) => (
              <PoetCard key={poet.id} poet={poet} />
            ))}
          </div>

          <Link
            className="flex sm:hidden items-center justify-center gap-1 mt-6 text-foreground hover:text-muted-foreground font-medium transition-colors"
            href="/poets"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
