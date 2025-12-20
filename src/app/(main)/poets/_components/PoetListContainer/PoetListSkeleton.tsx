import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';

type PoetListSkeletonProps = {
  className?: string;
};

export function PoetListSkeleton({ className }: PoetListSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card className="overflow-hidden" key={index}>
            <CardHeader className="p-4">
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
