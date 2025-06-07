'use client';

import { Loader2, Images, BookOpen, AlertCircle } from 'lucide-react';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import type { JapanSearchItem } from '@/lib/japansearch-types';

type RelatedMaterialsGalleryClientProps = {
  poetName: string;
  className?: string;
  materialsQuery: UseInfiniteQueryResult<
    InfiniteData<JapanSearchItem[], unknown>,
    Error
  >;
  imagesQuery: UseInfiniteQueryResult<
    InfiniteData<JapanSearchItem[], unknown>,
    Error
  >;
};

export function RelatedMaterialsGalleryClient({
  poetName,
  className,
  materialsQuery,
  imagesQuery,
}: RelatedMaterialsGalleryClientProps) {
  const {
    data: materialsData,
    fetchNextPage: fetchNextMaterials,
    hasNextPage: hasNextMaterials,
    isFetchingNextPage: isFetchingNextMaterials,
    isLoading: isLoadingMaterials,
    error: errorMaterials,
  } = materialsQuery;

  const {
    data: imagesData,
    fetchNextPage: fetchNextImages,
    hasNextPage: hasNextImages,
    isFetchingNextPage: isFetchingNextImages,
    isLoading: isLoadingImages,
    error: errorImages,
  } = imagesQuery;

  const materials = materialsData?.pages.flatMap((page) => page) || [];
  const images = imagesData?.pages.flatMap((page) => page) || [];

  const hasResults = materials.length > 0 || images.length > 0;
  const isLoading = isLoadingMaterials || isLoadingImages;

  const { loadMoreRef: materialsLoadMoreRef } = useInfiniteScroll({
    fetchNextPage: fetchNextMaterials,
    hasNextPage: hasNextMaterials || false,
    isFetchingNextPage: isFetchingNextMaterials,
  });

  const { loadMoreRef: imagesLoadMoreRef } = useInfiniteScroll({
    fetchNextPage: fetchNextImages,
    hasNextPage: hasNextImages || false,
    isFetchingNextPage: isFetchingNextImages,
  });

  if (isLoading && !hasResults) {
    return (
      <div className={`bg-background rounded-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">関連資料を検索中...</span>
        </div>
      </div>
    );
  }

  if (!hasResults && !isLoading) {
    return (
      <div className={`bg-background rounded-lg p-8 text-center ${className}`}>
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {poetName}に関連する資料が見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-background rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          関連文献・画像ギャラリー
        </h2>

        <Tabs className="w-full" defaultValue="materials">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="flex items-center" value="materials">
              <BookOpen className="h-4 w-4 mr-2" />
              文献・資料 ({materials.length})
            </TabsTrigger>
            <TabsTrigger className="flex items-center" value="images">
              <Images className="h-4 w-4 mr-2" />
              画像 ({images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6" value="materials">
            {errorMaterials ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{errorMaterials.message}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  再試行
                </Button>
              </div>
            ) : materials.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((item) => (
                    <JapanSearchCard
                      item={item}
                      key={item.id}
                      variant="default"
                    />
                  ))}
                </div>

                <div
                  className="h-10 flex items-center justify-center"
                  ref={materialsLoadMoreRef}
                >
                  {isFetchingNextMaterials && (
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>読み込み中...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                関連文献が見つかりませんでした
              </div>
            )}
          </TabsContent>

          <TabsContent className="mt-6" value="images">
            {errorImages ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{errorImages.message}</p>
                <Button
                  className="mt-4"
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  再試行
                </Button>
              </div>
            ) : images.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((item) => (
                    <JapanSearchCard
                      item={item}
                      key={item.id}
                      variant="compact"
                    />
                  ))}
                </div>

                <div
                  className="h-10 flex items-center justify-center"
                  ref={imagesLoadMoreRef}
                >
                  {isFetchingNextImages && (
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>読み込み中...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                関連画像が見つかりませんでした
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
