'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Hina_Mincho } from 'next/font/google';
import { ArrowRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';
import { MonumentWithRelations } from '@/types/definitions/api';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

interface TodaysHaikuClientComponentProps {
  monument: MonumentWithRelations;
}

export function TodaysHaikuClientComponent({
  monument,
}: TodaysHaikuClientComponentProps) {
  const haiku =
    monument.inscriptions?.[0]?.poems?.[0]?.text ||
    monument.inscriptions?.[0]?.original_text ||
    '';
  const poetName = monument.poets?.[0]?.name || '';
  const location = monument.locations?.[0];
  const locationText = location
    ? `${location.prefecture || ''} ${location.municipality || ''}`
    : '';
  const imageUrl = monument.media?.[0]?.url || null;

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <>
            <Image
              alt={monument.canonical_name}
              className="object-cover"
              fill
              src={imageUrl}
            />
            <div className="absolute inset-0 bg-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent-purple" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-4 py-1 mb-8 text-sm font-medium text-accent-purple-foreground bg-accent-purple/30 rounded-full border border-accent-purple-light/30">
            今日の一句
          </span>
        </motion.div>

        <motion.h2
          className={cn(
            'text-3xl md:text-4xl lg:text-5xl text-primary-foreground leading-relaxed mb-8',
            hinaMincho.className
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {haiku}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-accent-purple-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          ― {poetName}
        </motion.p>

        {locationText && (
          <motion.div
            className="flex items-center justify-center gap-2 text-primary-foreground/90 mb-10"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm text-primary-foreground/90">
              {locationText}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Link
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-purple hover:bg-accent-purple-light text-accent-purple-foreground font-medium rounded-full transition-colors"
            href={`/monument/${monument.id}`}
          >
            この句碑を見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
