import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heart, MapPin, User } from 'lucide-react';

type ProfileSkeletonProps = {
  className?: string;
};

export function ProfileSkeleton({ className }: ProfileSkeletonProps) {
  return (
    <div className={`max-w-4xl mx-auto ${className || ''}`}>
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      <Tabs className="w-full" defaultValue="favorites">
        <TabsList className="mb-6 grid grid-cols-2 md:w-[400px]">
          <TabsTrigger className="flex items-center gap-2" value="favorites">
            <Heart className="size-4" />
            お気に入り句碑
            <Skeleton className="ml-1 w-6 h-4 rounded-full" />
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="visited">
            <MapPin className="size-4" />
            訪問済み句碑
            <Skeleton className="ml-1 w-6 h-4 rounded-full" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="bg-card rounded-lg border p-4 hover:shadow-sm transition-shadow"
                key={index}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User size={14} />
                      <Skeleton className="h-4 w-24" />
                      <span>·</span>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded" />
                </div>

                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visited">
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                className="bg-card rounded-lg border p-4 hover:shadow-sm transition-shadow"
                key={index}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User size={14} />
                      <Skeleton className="h-4 w-24" />
                      <span>·</span>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded" />
                </div>

                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-3" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
