'use client';

import { useState } from 'react';
import { DownloadIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

type DownloadFormat = 'csv' | 'jsonl';

const LABELS: Record<DownloadFormat, string> = {
  csv: 'CSV',
  jsonl: 'JSON Lines',
};

type DataDownloadButtonProps = {
  format: DownloadFormat;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'lg';
};

export function DataDownloadButton({
  format,
  className,
  variant = 'outline',
  size = 'default',
}: DataDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setHasFailed(false);

    let objectUrl: string | undefined;

    try {
      const response = await fetch(
        `/api/kuhi/monuments/export?format=${format}`
      );
      if (!response.ok) {
        throw new Error(`export failed: ${response.status}`);
      }

      const blob = await response.blob();
      const fileName =
        response.headers
          .get('Content-Disposition')
          ?.match(/filename="([^"]+)"/)?.[1] ?? `kuhi-monuments.${format}`;

      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setHasFailed(true);
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn('inline-flex flex-col items-start gap-1', className)}>
      <Button
        aria-busy={isDownloading}
        className="rounded-full px-7"
        disabled={isDownloading}
        onClick={() => {
          void handleDownload();
        }}
        size={size}
        type="button"
        variant={variant}
      >
        {isDownloading ? (
          <Loader2Icon aria-hidden className="animate-spin" />
        ) : (
          <DownloadIcon aria-hidden />
        )}
        <span className="grid">
          <span
            className={cn(
              'col-start-1 row-start-1',
              isDownloading && 'invisible'
            )}
          >
            {LABELS[format]}をダウンロード
          </span>
          <span
            aria-hidden={!isDownloading}
            className={cn(
              'col-start-1 row-start-1',
              !isDownloading && 'invisible'
            )}
          >
            準備しています
          </span>
        </span>
      </Button>
      {hasFailed && (
        <p className="text-sm text-destructive" role="alert">
          ダウンロードに失敗しました。時間をおいてお試しください。
        </p>
      )}
    </div>
  );
}
