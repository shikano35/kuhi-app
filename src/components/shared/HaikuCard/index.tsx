import Image from 'next/image';
import Link from 'next/link';
import { HaikuMonument } from '@/types/haiku';
import { truncateInscription } from '@/lib/utils';
import { MapPinIcon, UserIcon } from 'lucide-react';

type HaikuCardProps = {
  monument: HaikuMonument;
};

export function HaikuCard({ monument }: HaikuCardProps) {
  const { id, inscription, poets, locations, photo_url } = monument;
  const poet = poets[0];
  const location = locations[0];

  return (
    <Link href={`/monument/${id}`}>
      <div
        className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
        data-testid="haiku-card"
      >
        <div className="relative h-48 bg-muted">
          {photo_url ? (
            <Image
              alt={inscription}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={photo_url}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              写真はありません
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-medium mb-2 line-clamp-1">
            {truncateInscription(inscription)}
          </h3>

          <div className="mt-auto">
            {poet && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserIcon className="h-4 w-4 text-muted-foreground mr-1" />
                <span data-testid="poet-name">{poet.name}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="truncate" data-testid="location-name">
                  {location.prefecture} {location.municipality}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
