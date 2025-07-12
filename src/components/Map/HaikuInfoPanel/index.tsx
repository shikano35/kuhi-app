import Image from 'next/image';
import Link from 'next/link';
import { HaikuMonument } from '@/types/haiku';
import {
  XIcon,
  User,
  MapPin,
  Calendar,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type HaikuInfoPanelProps = {
  monument: HaikuMonument;
  onClose: () => void;
};

export function HaikuInfoPanel({ monument, onClose }: HaikuInfoPanelProps) {
  const {
    inscription,
    poets,
    locations,
    commentary,
    kigo,
    season,
    established_date,
    photo_url,
  } = monument;
  const poet = poets?.[0];
  const location = locations?.[0];

  return (
    <ScrollArea className="h-full">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <h2 className="text-xl font-semibold text-primary">句碑情報</h2>
          <Button
            aria-label="閉じる"
            className="h-8 w-8"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="px-4 py-2">
          <div className="relative h-64 w-full mb-6 rounded-md overflow-hidden bg-muted">
            {photo_url ? (
              <Image
                alt={inscription}
                className="object-cover"
                fill
                src={photo_url}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                写真はありません
              </div>
            )}
          </div>

          <div className="mb-6 space-y-4">
            <h3 className="text-xl font-semibold line-clamp-4 text-primary">
              {inscription}
            </h3>

            {poet?.name && (
              <div className="flex items-center space-x-2">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium text-sm text-primary">
                  {poet.name}
                </span>
              </div>
            )}

            {location && (
              <div className="flex items-start space-x-2">
                <MapPin className="size-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-primary">
                  {location.prefecture} {location.municipality}{' '}
                  {location.place_name}
                </span>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <div className="mb-4 space-y-3">
            {kigo && (
              <div className="flex">
                <span className="text-sm font-medium w-16 text-primary">
                  季語 :
                </span>
                <span className="text-sm text-primary">{kigo}</span>
              </div>
            )}
            {season && (
              <div className="flex">
                <span className="text-sm font-medium w-16 text-primary">
                  季節 :
                </span>
                <span className="text-sm text-primary">{season}</span>
              </div>
            )}
            {established_date && (
              <div className="flex items-center mt-4">
                <Calendar className="size-4 text-muted-foreground mr-2" />
                <span className="text-sm text-primary">{established_date}</span>
              </div>
            )}
          </div>

          {commentary && (
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Info className="size-4 text-muted-foreground mr-2" />
                <h4 className="text-sm font-medium text-primary">解説</h4>
              </div>
              <p className="text-sm text-primary">{commentary}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between px-4 pb-6">
          <Button asChild>
            <Link href={`/monument/${monument.id}`}>詳細を見る</Link>
          </Button>

          {location && (
            <Button
              className="flex items-center"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
                  '_blank'
                )
              }
              variant="outline"
            >
              <ExternalLink className="size-4 mr-1" />
              地図で開く
            </Button>
          )}
        </CardFooter>
      </Card>
    </ScrollArea>
  );
}
