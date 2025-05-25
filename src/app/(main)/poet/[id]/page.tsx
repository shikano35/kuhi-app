import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getAllPoets, getHaikuMonumentsByPoet } from '@/lib/api';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { Button } from '@/components/ui/button';

type PoetPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: PoetPageProps): Promise<Metadata> {
  const poets = await getAllPoets();
  const poet = poets.find((p) => p.id === Number(params.id));

  if (!poet) {
    return {
      title: '俳人が見つかりません | くひめぐり',
    };
  }

  return {
    title: `${poet.name} | くひめぐり`,
    description: poet.biography || `${poet.name}の句碑情報ページです。`,
  };
}

export default async function PoetPage({ params }: PoetPageProps) {
  const poets = await getAllPoets();
  const poet = poets.find((p) => p.id === Number(params.id));

  if (!poet) {
    notFound();
  }

  const relatedMonuments = await getHaikuMonumentsByPoet(Number(params.id));

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

        <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {poet.image_url && (
                <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-muted">
                  <Image
                    alt={poet.name}
                    className="object-cover"
                    fill
                    priority
                    sizes="192px"
                    src={poet.image_url}
                  />
                </div>
              )}

              <div className="flex-grow text-center md:text-left">
                <h1 className="text-3xl font-bold mb-4 text-primary">
                  {poet.name}
                </h1>

                {poet.biography && (
                  <p className="text-muted-foreground mb-4 whitespace-pre-line leading-6.5">
                    {poet.biography}
                  </p>
                )}

                {poet.link_url && (
                  <a
                    className="inline-flex items-center text-muted-foreground hover:underline hover:text-primary hover:underline-offset-2"
                    href={poet.link_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    詳細情報を見る
                    <ExternalLink className="ml-1" size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{poet.name}の句碑</h2>

        {relatedMonuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedMonuments.map((monument) => (
              <HaikuCard key={monument.id} monument={monument} />
            ))}
          </div>
        ) : (
          <div className="bg-background rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              この俳人に関連する句碑は見つかりませんでした。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
