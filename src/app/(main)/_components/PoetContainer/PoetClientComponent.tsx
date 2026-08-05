import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PoetCard } from '@/components/shared/PoetCard';
import { Poet } from '@/types/definitions/haiku';

type PoetClientComponentProps = {
  poets: Poet[];
};

export function PoetClientComponent({ poets }: PoetClientComponentProps) {
  const displayPoets = poets.slice(0, 4);

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          俳人で探す
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPoets.map((poet) => (
            <PoetCard key={poet.id} poet={poet} />
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button asChild className="rounded-full px-8 py-6 text-base">
          <Link href="/poets">すべての俳人を見る</Link>
        </Button>
      </div>
    </section>
  );
}
