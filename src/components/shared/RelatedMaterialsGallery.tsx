'use client';

import { useState, useEffect } from 'react';
import { Loader2, Images, BookOpen, AlertCircle } from 'lucide-react';
import {
  searchRelatedMaterials,
  searchImages,
  JapanSearchItem,
} from '@/lib/japansearch';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type RelatedMaterialsGalleryProps = {
  poetName: string;
  className?: string;
};

export function RelatedMaterialsGallery({
  poetName,
  className,
}: RelatedMaterialsGalleryProps) {
  const [materials, setMaterials] = useState<JapanSearchItem[]>([]);
  const [images, setImages] = useState<JapanSearchItem[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingMoreMaterials, setLoadingMoreMaterials] = useState(false);
  const [loadingMoreImages, setLoadingMoreImages] = useState(false);
  const [errorMaterials, setErrorMaterials] = useState<string | null>(null);
  const [errorImages, setErrorImages] = useState<string | null>(null);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [imagesPage, setImagesPage] = useState(1);
  const [hasMoreMaterials, setHasMoreMaterials] = useState(true);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const ITEMS_PER_PAGE = 12;

  // 関連文献を取得
  const loadMaterials = async (loadMore = false) => {
    if ((loadingMaterials && !loadMore) || (loadingMoreMaterials && loadMore))
      return;

    if (loadMore) {
      setLoadingMoreMaterials(true);
    } else {
      setLoadingMaterials(true);
      setErrorMaterials(null);
      setMaterials([]);
      setMaterialsPage(1);
      setHasMoreMaterials(true);
    }

    try {
      const page = loadMore ? materialsPage + 1 : 1;
      const results = await searchRelatedMaterials(
        poetName,
        ITEMS_PER_PAGE,
        page
      );

      if (loadMore) {
        const existingIds = new Set(materials.map((item) => item.id));
        const newResults = results.filter((item) => !existingIds.has(item.id));
        setMaterials((prev) => [...prev, ...newResults]);
        setMaterialsPage(page);

        if (results.length < ITEMS_PER_PAGE) {
          setHasMoreMaterials(false);
        }
      } else {
        setMaterials(results);
        if (results.length < ITEMS_PER_PAGE) {
          setHasMoreMaterials(false);
        }
      }
    } catch (error) {
      console.error('関連文献の取得に失敗:', error);
      setErrorMaterials('関連文献の取得に失敗しました。');
      if (loadMore) {
        setHasMoreMaterials(false);
      }
    } finally {
      if (loadMore) {
        setLoadingMoreMaterials(false);
      } else {
        setLoadingMaterials(false);
      }
    }
  };

  // 関連画像を取得
  const loadImages = async (loadMore = false) => {
    if ((loadingImages && !loadMore) || (loadingMoreImages && loadMore)) return;

    if (loadMore) {
      setLoadingMoreImages(true);
    } else {
      setLoadingImages(true);
      setErrorImages(null);
      setImages([]);
      setImagesPage(1);
      setHasMoreImages(true);
    }

    try {
      const page = loadMore ? imagesPage + 1 : 1;
      const results = await searchImages(
        `${poetName} 俳句 句碑`,
        ITEMS_PER_PAGE,
        page
      );

      if (loadMore) {
        const existingIds = new Set(images.map((item) => item.id));
        const newResults = results.filter((item) => !existingIds.has(item.id));
        setImages((prev) => [...prev, ...newResults]);
        setImagesPage(page);

        if (results.length < ITEMS_PER_PAGE) {
          setHasMoreImages(false);
        }
      } else {
        setImages(results);
        if (results.length < ITEMS_PER_PAGE) {
          setHasMoreImages(false);
        }
      }
    } catch (error) {
      console.error('関連画像の取得に失敗:', error);
      setErrorImages('関連画像の取得に失敗しました。');
      if (loadMore) {
        setHasMoreImages(false);
      }
    } finally {
      if (loadMore) {
        setLoadingMoreImages(false);
      } else {
        setLoadingImages(false);
      }
    }
  };

  useEffect(() => {
    loadMaterials();
    loadImages();
  }, [poetName]);

  const hasResults = materials.length > 0 || images.length > 0;
  const isLoading = loadingMaterials || loadingImages;

  if (isLoading && !hasResults) {
    return (
      <div className={`bg-background rounded-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">関連資料を検索中...</span>
        </div>
      </div>
    );
  }

  if (!hasResults && !isLoading) {
    return (
      <div className={`bg-background rounded-lg p-8 text-center ${className}`}>
        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
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
          <BookOpen className="w-6 h-6 mr-2" />
          関連文献・画像ギャラリー
        </h2>

        <Tabs className="w-full" defaultValue="materials">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="flex items-center" value="materials">
              <BookOpen className="w-4 h-4 mr-2" />
              文献・資料 ({materials.length})
            </TabsTrigger>
            <TabsTrigger className="flex items-center" value="images">
              <Images className="w-4 h-4 mr-2" />
              画像 ({images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6" value="materials">
            {errorMaterials ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{errorMaterials}</p>
                <Button
                  className="mt-4"
                  onClick={() => loadMaterials(false)}
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

                {hasMoreMaterials && (
                  <div className="text-center mt-6">
                    <Button
                      disabled={loadingMoreMaterials}
                      onClick={() => loadMaterials(true)}
                      variant="outline"
                    >
                      {loadingMoreMaterials ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          読み込み中...
                        </>
                      ) : (
                        'さらに表示'
                      )}
                    </Button>
                  </div>
                )}
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
                <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{errorImages}</p>
                <Button
                  className="mt-4"
                  onClick={() => loadImages(false)}
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

                {hasMoreImages && (
                  <div className="text-center mt-6">
                    <Button
                      disabled={loadingMoreImages}
                      onClick={() => loadImages(true)}
                      variant="outline"
                    >
                      {loadingMoreImages ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          読み込み中...
                        </>
                      ) : (
                        'さらに表示'
                      )}
                    </Button>
                  </div>
                )}
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
