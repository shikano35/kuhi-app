import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  Image as ImageIcon,
  FileText,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { JapanSearchItem } from '@/lib/japansearch-types';

type JapanSearchCardProps = {
  item: JapanSearchItem;
  variant?: 'default' | 'compact';
};

export default function JapanSearchCard({
  item,
  variant = 'default',
}: JapanSearchCardProps) {
  // アイテムの表示用データを整理
  const title = item.common?.title || item.common?.description || '無題';
  const description = item.common?.description || '';
  const creator = item.common?.creator;
  const contributor = item.common?.contributor;
  const temporal = item.common?.temporal || item.rdfindex?.temporal;
  const spatial = item.common?.spatial || item.rdfindex?.spatial;
  const type =
    item.common?.type || (item.rdfindex?.type && item.rdfindex.type[0]);
  const thumbnailUrl = item.common?.thumbnailUrl;
  const dataProvider = item.common?.dataProvider;

  const allCreators = [
    ...(Array.isArray(creator) ? creator : creator ? [creator] : []),
    ...(Array.isArray(contributor)
      ? contributor
      : contributor
        ? [contributor]
        : []),
  ].filter((c, i, arr) => c && arr.indexOf(c) === i);
  const creatorText = allCreators.length > 0 ? allCreators[0] : '';

  const temporalText = Array.isArray(temporal)
    ? temporal[0]
    : typeof temporal === 'string'
      ? temporal
      : '';

  const getSpatialText = (): string => {
    if (!spatial) return '';
    if (Array.isArray(spatial)) {
      const filteredSpatial = spatial.filter(
        (s) => typeof s === 'string' && !s.includes(':')
      );
      return filteredSpatial[0] || '';
    }
    return '';
  };
  const spatialText = getSpatialText();

  const getTypeIcon = () => {
    if (thumbnailUrl || type?.includes('画像') || type?.includes('写真')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const imageUrl = Array.isArray(thumbnailUrl) ? thumbnailUrl[0] : thumbnailUrl;
  const hasValidImage =
    imageUrl &&
    imageUrl.trim() !== '' &&
    (imageUrl.startsWith('https://') || imageUrl.startsWith('http://'));

  return (
    <Link href={`/gallery/${encodeURIComponent(item.id)}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full overflow-hidden">
        <div className="relative">
          {hasValidImage ? (
            <div
              className={`w-full overflow-hidden bg-muted ${variant === 'compact' ? 'aspect-square' : 'aspect-video'}`}
            >
              <Image
                alt={Array.isArray(title) ? title[0] : title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                height={200}
                src={imageUrl}
                width={300}
              />
            </div>
          ) : (
            <div
              className={`w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 ${variant === 'compact' ? 'aspect-square' : 'aspect-video'}`}
            >
              <div className="text-center">
                {getTypeIcon()}
                <p className="text-xs text-muted-foreground mt-2">画像なし</p>
              </div>
            </div>
          )}

          {type && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs shadow-sm">
                {type}
              </Badge>
            </div>
          )}

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge
              className="bg-white/90 text-xs shadow-sm"
              variant="secondary"
            >
              <ExternalLink className="h-3 w-3" />
            </Badge>
          </div>
        </div>

        <CardContent className={variant === 'compact' ? 'p-3' : 'p-4'}>
          <div className="space-y-2">
            <h3
              className={`font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}
            >
              {Array.isArray(title) ? title[0] : title}
            </h3>

            {variant !== 'compact' && (
              <>
                {creatorText && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="truncate">{creatorText}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {temporalText && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{temporalText}</span>
                    </span>
                  )}
                  {spatialText && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{spatialText}</span>
                    </span>
                  )}
                </div>

                {description && description !== title && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {dataProvider && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{dataProvider}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
