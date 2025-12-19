'use client';

import Image from 'next/image';
import {
  MapPin,
  User,
  Book,
  Info,
  MapIcon,
  ExternalLink,
  Clock,
  BrickWall,
  UserIcon,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { formatEstablishedDate } from '@/lib/utils';
import { FavoriteButton } from '../FavoriteButton';
import { VisitButton } from '../VisitButton';
import { BackButton } from '@/components/BackButton';
import { HaikuMonument } from '@/types/definitions/haiku';

type MonumentDetailClientComponentProps = {
  monument: HaikuMonument;
};

export function MonumentDetailClientComponent({
  monument,
}: MonumentDetailClientComponentProps) {
  const poet = monument.poets[0];
  const location = monument.locations[0];
  const source = monument.sources?.[0];

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <BackButton fallbackUrl="/list">一覧に戻る</BackButton>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative h-64 w-full lg:h-96 rounded-lg overflow-hidden shadow-md mb-4 bg-background">
              {monument.photo_url ? (
                <Image
                  alt={monument.inscription}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={monument.photo_url || '/images/placeholder-monument.jpg'}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">写真がありません</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <FavoriteButton monumentId={monument.id} />
            </div>

            <div className="mb-4">
              <VisitButton monumentId={monument.id} />
            </div>

            {monument.established_date && (
              <div className="bg-background rounded-lg shadow p-4 mb-4 leading-6.5">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Calendar className="mr-2 mt-0.25 text-primary size-5" />
                  建立情報
                </h3>
                <p className="text-primary">
                  建立日: {formatEstablishedDate(monument.established_date)}
                  {monument.founder && (
                    <>
                      <br />
                      建立者: {monument.founder}
                    </>
                  )}
                </p>
              </div>
            )}
            {monument.kigo && (
              <div className="bg-background rounded-lg shadow p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock className="mr-2 mt-0.25 text-primary size-5" />
                  季語
                </h3>
                <div className="flex flex-wrap gap-2">
                  {monument.kigo.split(',').map((kigo, index) => (
                    <span
                      className="bg-muted rounded-full px-3 py-1 text-sm text-primary"
                      key={index}
                    >
                      {kigo.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {monument.material && (
              <div className="bg-background rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <BrickWall className="mr-2 mt-0.25 text-primary size-5" />
                  材質
                </h3>
                <p className="text-primary">{monument.material}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-3 leading-tight">
              {monument.inscription}
            </h1>

            {poet && (
              <div className="mb-6">
                <Link
                  className="flex items-center text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2"
                  href={`/poet/${poet.id}`}
                >
                  <User className="mr-1 mt-0.25 size-5" />
                  {poet.name}
                </Link>
              </div>
            )}

            {monument.commentary && (
              <div className="bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Info className="mr-2 mt-0.25 text-primary size-5" />
                  解説
                </h2>
                <p className="text-primary whitespace-pre-line">
                  {monument.commentary}
                </p>
              </div>
            )}

            {poet && (
              <div className="relative bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <User className="mr-2 mt-1 text-primary size-5" />
                  俳人情報
                </h2>

                <div className="flex items-start ">
                  {poet.image_url ? (
                    <div className="relative h-32 w-32 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        alt={poet.name}
                        className="object-cover"
                        fill
                        sizes="96px"
                        src={poet.image_url}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 w-32 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-muted">
                      <UserIcon className="size-10 mt-0.25 text-muted-foreground" />
                    </div>
                  )}

                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-2">{poet.name}</h3>
                    {poet.biography && (
                      <p className="text-muted-foreground">{poet.biography}</p>
                    )}
                    {poet.link_url && (
                      <div className="flex items-center justify-end">
                        <a
                          className=" mt-2 text-muted-foreground underline text-sm flex items-center hover:text-primary underline-offset-2"
                          href={poet.link_url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          詳細を見る
                          <ExternalLink className="ml-1 size-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {source && (
              <div className="relative bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Book className="mr-2 mt-0.25 text-primary size-5" />
                  出典
                </h2>
                <p className="text-primary">
                  『{source.title}』{source.author && ` (${source.author})`}
                  {source.publisher && (
                    <>
                      <br />
                      出版: {source.publisher}
                    </>
                  )}
                  {source.source_year && (
                    <>
                      <br />
                      発行年: {source.source_year}年
                    </>
                  )}
                </p>
                {source.url && (
                  <div className="flex items-center justify-end">
                    <a
                      className="mt-2 text-muted-foreground underline text-sm mt-6 flex items-center hover:text-primary underline-offset-2"
                      href={source.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      リンク
                      <ExternalLink className="ml-1 size-4" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {location && (
              <div className="relative bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapIcon className="mr-2 mt-0.25 text-primary size-5" />
                  所在地
                </h3>
                <p className="mb-2 font-medium">{location.place_name}</p>
                <p className="text-primary mb-4">
                  {location.region} {location.prefecture}{' '}
                  {location.municipality} {location.address}
                </p>

                {location.latitude && location.longitude && (
                  <div className="flex items-center justify-end">
                    <Link
                      className="mt-2 text-muted-foreground underline underline-offset-2 hover:text-primary text-sm flex items-center"
                      href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MapPin className="mr-1 mt-0.5 size-4" />
                      Googleマップで見る
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
