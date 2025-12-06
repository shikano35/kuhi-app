import { Card, CardContent } from '@/components/ui/card';

function SkeletonCard() {
  return (
    <Card className="h-full overflow-hidden border-border">
      <div className="h-40 bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function PickupSkeleton() {
  return (
    <section className="w-full bg-linear-to-b from-muted/30 to-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="mb-8">
            <div className="h-8 w-40 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-60 bg-muted rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-52 bg-muted rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
