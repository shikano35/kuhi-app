import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Poet } from '@/types/definitions/api';

type PoetProfileProps = {
  poet: Poet;
};

export function PoetProfile({ poet }: PoetProfileProps) {
  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8 flex flex-col">
      <div className="pt-6 px-6 md:pt-8 md:px-8 flex-grow">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {poet.image_url && (
            <div className="relative w-48 h-80 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-muted">
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

          <div className="flex-grow text-center md:text-start">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              {poet.name}
            </h1>

            {poet.biography && (
              <p className="text-muted-foreground mb-12 whitespace-pre-line leading-6.5">
                {poet.biography}
              </p>
            )}
          </div>
        </div>
      </div>

      {poet.link_url && (
        <div className="flex items-center justify-end -mt-6 pb-6 px-6 md:-mt-8 md:pb-8 md:px-8">
          <a
            className="flex items-center text-muted-foreground p-1 underline hover:text-primary underline-offset-2"
            href={poet.link_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            詳細情報を見る
            <ExternalLink className="ml-1 mt-0.5" size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
