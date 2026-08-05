import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';

type NewsSkeletonProps = {
  className?: string;
};

export function NewsSkeleton({ className }: NewsSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <Tabs className="w-full" defaultValue="all">
        <TabsList className="mb-6 flex flex-wrap h-auto">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <Skeleton className="h-9 w-20 mb-1" />
          <Skeleton className="h-9 w-24 mb-1" />
          <Skeleton className="h-9 w-16 mb-1" />
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card className="overflow-hidden" key={index}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
