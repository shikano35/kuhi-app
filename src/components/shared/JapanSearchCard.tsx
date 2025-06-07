'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ExternalLink, TextSearch } from 'lucide-react';
import { JapanSearchItem } from '@/lib/japansearch';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';

type JapanSearchCardProps = {
  item: JapanSearchItem;
  className?: string;
  variant?: 'default' | 'compact';
  showDetailButton?: boolean;
};

export function JapanSearchCard({
  item,
  className,
  variant = 'default',
}: JapanSearchCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const { common } = item;
  const title = common.title || '無題';
  const thumbnailUrl = common.thumbnailUrl;
  const landingPage = common.landingPage;
  const type = common.type;

  const isCompact = variant === 'compact';
  const isImageGallery = variant === 'compact';

  const hasValidImage =
    !imageError &&
    thumbnailUrl &&
    typeof thumbnailUrl === 'string' &&
    thumbnailUrl.trim() !== '' &&
    thumbnailUrl.trim() !== 'null' &&
    thumbnailUrl.trim() !== 'undefined' &&
    (thumbnailUrl.startsWith('https://') ||
      thumbnailUrl.startsWith('http://') ||
      thumbnailUrl.startsWith('/'));

  const shouldUnoptimizeImage = (url: string): boolean => {
    if (!url) return false;
    return (
      !url.includes('localhost') &&
      !url.includes('.go.jp') &&
      !url.startsWith('/')
    );
  };

  const handleDetailClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let navigationId = item.id;

    if (
      !navigationId ||
      navigationId.trim() === '' ||
      navigationId === 'undefined'
    ) {
      navigationId = title;
    }

    if (navigationId) {
      const safeId = encodeURIComponent(navigationId);
      router.push(`/gallery/${safeId}`);
    } else {
      console.error('有効な識別子が見つかりません:', item);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親のクリックイベントを停止
    if (landingPage) {
      window.open(landingPage, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isImageGallery) {
    return (
      <div
        className={cn(
          'relative bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group',
          'cursor-pointer aspect-square',
          className
        )}
        onClick={handleDetailClick}
      >
        {hasValidImage ? (
          <Image
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            fill
            onError={handleImageError}
            sizes="300px"
            src={thumbnailUrl}
            unoptimized={shouldUnoptimizeImage(thumbnailUrl)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{title}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-white/90">
                <TextSearch className="w-3 h-3 mr-1 mt-0.25" />
                詳細を見る
              </div>
              {landingPage && (
                <button
                  className="flex items-center text-xs text-white/90 hover:text-white transition-colors"
                  onClick={handleExternalClick}
                  type="button"
                >
                  <ExternalLink className="w-3 h-3 mr-1 mt-0.25" />
                  外部リンク
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow',
        'overflow-hidden group cursor-pointer',
        className
      )}
      onClick={handleDetailClick}
    >
      {hasValidImage ? (
        <div
          className={cn(
            'relative overflow-hidden bg-muted',
            isCompact ? 'h-32' : 'h-48'
          )}
        >
          <Image
            alt={title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            onError={handleImageError}
            sizes={isCompact ? '200px' : '300px'}
            src={thumbnailUrl}
            unoptimized={shouldUnoptimizeImage(thumbnailUrl)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      ) : (
        <div
          className={cn(
            'relative overflow-hidden bg-muted flex items-center justify-center',
            isCompact ? 'h-32' : 'h-48'
          )}
        >
          <span className="text-muted-foreground text-sm">
            画像がありません
          </span>
        </div>
      )}

      <div className={cn('p-4', isCompact ? 'p-3' : 'p-4')}>
        <h3
          className={cn(
            'font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors',
            isCompact ? 'text-sm' : 'text-base'
          )}
        >
          {title}
        </h3>

        <div
          className={cn(
            'space-y-1 mb-8',
            isCompact ? 'space-y-1' : 'space-y-2'
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {type && (
              <Badge className="text-xs" variant="secondary">
                {type}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {landingPage && (
              <button
                className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
                onClick={handleExternalClick}
                type="button"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                外部リンク
              </button>
            )}
          </div>{' '}
        </div>
      </div>
    </div>
  );
}
