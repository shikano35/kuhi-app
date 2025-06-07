import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Image as ImageIcon, FileText } from 'lucide-react';
import Image from 'next/image';
import type { JapanSearchItem } from '@/lib/japansearch-types';

type JapanSearchCardProps = {
  item: JapanSearchItem;
};

export function JapanSearchCard({ item }: JapanSearchCardProps) {
  // アイテムの表示用データを整理
  const title = item.common?.title || item.common?.description || '無題';
  const description = item.common?.description || '';
  const creator = item.common?.creator || '';
  const temporal = item.common?.temporal || '';
  const subject = item.common?.subject || '';
  const type = item.common?.type || '';
  const thumbnailUrl = item.common?.thumbnailUrl;
  const sourceUrl = item.common?.landingPage || item.common?.identifier;

  // アイテムタイプに応じたアイコンを選択
  const getTypeIcon = () => {
    if (thumbnailUrl || type?.includes('画像') || type?.includes('写真')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const handleCardClick = () => {
    if (sourceUrl) {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="relative">
        {thumbnailUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
            <Image
              alt={Array.isArray(title) ? title[0] : title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
              height={200}
              src={Array.isArray(thumbnailUrl) ? thumbnailUrl[0] : thumbnailUrl}
              width={300}
            />
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-t-lg">
            <div className="text-center">
              {getTypeIcon()}
              <p className="text-xs text-muted-foreground mt-2">画像なし</p>
            </div>
          </div>
        )}

        {sourceUrl && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-white/90 text-xs" variant="secondary">
              <ExternalLink className="h-3 w-3" />
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            {title}
          </h3>

          {creator && (
            <p className="text-xs text-muted-foreground">作成者: {creator}</p>
          )}

          {temporal && (
            <p className="text-xs text-muted-foreground">年代: {temporal}</p>
          )}

          {description && description !== title && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-1 pt-2">
            {type && (
              <Badge className="text-xs" variant="outline">
                {type}
              </Badge>
            )}
            {subject && (
              <Badge className="text-xs" variant="secondary">
                {subject}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JapanSearchCard;
