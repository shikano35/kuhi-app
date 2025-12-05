'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MonumentWithRelations, Poet } from '@/types/definitions/api';
import { Hina_Mincho } from 'next/font/google';
import { cn } from '@/lib/cn';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

interface PickupClientComponentProps {
  monuments: MonumentWithRelations[];
  poets: Poet[];
}

function MonumentCard({
  index,
  monument,
}: {
  monument: MonumentWithRelations;
  index: number;
}) {
  const haiku =
    monument.inscriptions?.[0]?.poems?.[0]?.text ||
    monument.inscriptions?.[0]?.original_text ||
    '';
  const poetName = monument.poets?.[0]?.name || '詠み人知らず';
  const location = monument.locations?.[0];
  const imageUrl = monument.media?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link href={`/monument/${monument.id}`}>
        <Card className="group h-full hover:shadow-lg transition-all duration-300 overflow-hidden border-border bg-card">
          <div className="relative h-40 bg-muted overflow-hidden">
            {imageUrl ? (
              <Image
                alt={monument.canonical_name}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                fill
                src={imageUrl}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                <span
                  className={cn(
                    'text-4xl text-accent-purple/30',
                    hinaMincho.className
                  )}
                >
                  句
                </span>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <p
              className={cn(
                'text-base text-foreground line-clamp-2 mb-2',
                hinaMincho.className
              )}
            >
              {haiku}
            </p>

            <p className="text-sm text-accent-purple mb-2">― {poetName}</p>

            {location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>
                  {location.prefecture} {location.municipality}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function PoetCard({ index, poet }: { poet: Poet; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link href={`/poet/${poet.id}`}>
        <Card className="group h-full hover:shadow-lg transition-all duration-300 overflow-hidden border-border bg-card">
          <div className="relative h-40 bg-muted overflow-hidden">
            {poet.image_url ? (
              <Image
                alt={poet.name}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                fill
                src={poet.image_url}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                <User className="w-12 h-12 text-accent-purple/30" />
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-foreground mb-1">
              {poet.name}
            </h3>

            {poet.name_kana && (
              <p className="text-xs text-muted-foreground mb-2">
                {poet.name_kana}
              </p>
            )}

            {poet.biography && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {poet.biography}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function PickupClientComponent({
  monuments,
  poets,
}: PickupClientComponentProps) {
  return (
    <section className="w-full bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                注目の句碑
              </h2>
            </div>
            <Link
              className="hidden sm:flex items-center gap-1 text-accent-purple hover:text-accent-purple-light font-medium transition-colors"
              href="/list"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {monuments.map((monument, index) => (
              <MonumentCard
                index={index}
                key={monument.id}
                monument={monument}
              />
            ))}
          </div>

          <Link
            className="flex sm:hidden items-center justify-center gap-1 mt-6 text-accent-purple hover:text-accent-purple-light font-medium transition-colors"
            href="/list"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                俳人ピックアップ
              </h2>
            </div>
            <Link
              className="hidden sm:flex items-center gap-1 text-accent-purple hover:text-accent-purple-light font-medium transition-colors"
              href="/poets"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {poets.map((poet, index) => (
              <PoetCard index={index} key={poet.id} poet={poet} />
            ))}
          </div>

          <Link
            className="flex sm:hidden items-center justify-center gap-1 mt-6 text-accent-purple hover:text-accent-purple-light font-medium transition-colors"
            href="/poets"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
