import { Skeleton } from '@/components/ui/skeleton';

export function PoetSkeleton() {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          俳人で探す
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="bg-background rounded-lg shadow-md overflow-hidden"
              key={index}
            >
              <div className="relative h-48">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-6 mb-2 w-24" />
                <Skeleton className="h-4 mb-1 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Skeleton className="h-12 w-40 mx-auto rounded-full" />
      </div>
    </section>
  );
}
