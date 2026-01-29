'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function SkeletonImage({
  src,
  alt,
  className,
  containerClassName,
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative', containerClassName)}>
      {!isLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
      <Image
        alt={alt}
        className={cn(isLoaded ? 'opacity-100' : 'opacity-0', className)}
        fill
        onError={() => setIsLoaded(true)}
        onLoad={() => setIsLoaded(true)}
        src={src}
      />
    </div>
  );
}
