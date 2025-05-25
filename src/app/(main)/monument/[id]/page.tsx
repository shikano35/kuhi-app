import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  User,
  Book,
  Info,
  ArrowLeft,
  MapIcon,
  ExternalLink,
  Clock,
  BrickWall,
} from 'lucide-react';
import Link from 'next/link';
import { getHaikuMonumentById } from '@/lib/api';
import { formatEstablishedDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type MonumentPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: MonumentPageProps): Promise<Metadata> {
  const { id } = await params;
  const monument = await getHaikuMonumentById(Number(id));

  if (!monument) {
    return {
      title: '句碑が見つかりません | くひめぐり',
    };
  }

  const poetName = monument.poets[0]?.name || '不明';

  return {
    title: `${monument.inscription.slice(0, 20)}${monument.inscription.length > 20 ? '...' : ''} - ${poetName} | くひめぐり`,
    description: monument.commentary || '句碑の詳細情報ページです。',
  };
}

export default async function MonumentPage({ params }: MonumentPageProps) {
  const monument = await getHaikuMonumentById(Number(params.id));

  if (!monument) {
    notFound();
  }

  const location = monument.locations[0];
  const poet = monument.poets[0];
  const source = monument.sources[0];

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <Button asChild className="mb-6 hover:bg-input" variant="ghost">
          <Link
            className="flex items-center text-primary mb-6 hover:text-primary/80"
            href="/list"
          >
            <ArrowLeft className="mr-1" size={16} />
            一覧に戻る
          </Link>
        </Button>

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

            {location && (
              <div className="bg-background rounded-lg shadow p-4 mb-4 leading-6.5">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapIcon className="mr-2 text-primary size-5" />
                  所在地
                </h3>
                <p className="mb-2 font-medium">{location.place_name}</p>
                <p className="text-primary mb-4">
                  {location.region} {location.prefecture}{' '}
                  {location.municipality}
                  <br />
                  {location.address}
                </p>

                {location.latitude && location.longitude && (
                  <Link
                    className="text-muted-foreground hover:underline hover:underline-offset-2 hover:text-primary text-sm flex items-center"
                    href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MapPin className="mr-1 size-4" />
                    Googleマップで見る
                  </Link>
                )}
              </div>
            )}

            {monument.established_date && (
              <div className="bg-background rounded-lg shadow p-4 mb-4 leading-6.5">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Calendar className="mr-2 text-primary size-5" />
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
              <div className="bg-background rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock className="mr-2 text-primary size-5" />
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
                  <BrickWall className="mr-2 text-primary size-5" />
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
                  <User className="mr-1 size-5" />
                  {poet.name}
                </Link>
              </div>
            )}

            {monument.commentary && (
              <div className="bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Info className="mr-2 text-primary size-5" />
                  解説
                </h2>
                <p className="text-primary whitespace-pre-line">
                  {monument.commentary}
                </p>
              </div>
            )}

            {poet && (
              <div className="bg-background rounded-lg shadow p-6 mb-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <User className="mr-2 text-primary size-5" />
                  俳人情報
                </h2>

                <div className="flex items-start">
                  {poet.image_url && (
                    <div className="relative h-32 w-32 rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        alt={poet.name}
                        className="object-cover"
                        fill
                        sizes="96px"
                        src={poet.image_url}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">{poet.name}</h3>
                    {poet.biography && (
                      <p className="text-muted-foreground">{poet.biography}</p>
                    )}
                    {poet.link_url && (
                      <a
                        className="text-muted-foreground hover:underline text-sm mt-6 flex items-center justify-end hover:text-primary hover:underline-offset-2"
                        href={poet.link_url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        詳細を見る
                        <ExternalLink className="ml-1 size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {source && (
              <div className="bg-background rounded-lg shadow p-6 leading-6.5">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Book className="mr-2 text-primary size-5" />
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
                  <a
                    className="text-muted-foreground hover:underline text-sm mt-6 flex items-center justify-end hover:text-primary hover:underline-offset-2"
                    href={source.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    リンク
                    <ExternalLink className="ml-1 size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
