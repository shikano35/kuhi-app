import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';

type SourcesSkeletonProps = {
  className?: string;
};

export function SourcesSkeleton({ className }: SourcesSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card className="overflow-hidden" key={index}>
            <CardHeader className="p-4">
              <Skeleton className="h-7 w-4/5" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <dl className="grid grid-cols-2 gap-2">
                <dt className="font-semibold text-muted-foreground">著者</dt>
                <dd>
                  <Skeleton className="h-4 w-20" />
                </dd>

                <dt className="font-semibold text-muted-foreground">出版社</dt>
                <dd>
                  <Skeleton className="h-4 w-24" />
                </dd>

                <dt className="font-semibold text-muted-foreground">出版年</dt>
                <dd>
                  <Skeleton className="h-4 w-16" />
                </dd>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
