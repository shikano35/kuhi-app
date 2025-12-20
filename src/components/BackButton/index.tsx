'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

type BackButtonProps = {
  fallbackUrl?: string;
  children?: React.ReactNode;
  className?: string;
};

export function BackButton({
  fallbackUrl = '/',
  children = '戻る',
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      className={cn(
        'mb-6 hover:bg-input flex items-center text-lg text-primary hover:text-primary/80',
        className
      )}
      onClick={handleBackClick}
      variant="ghost"
    >
      <ArrowLeft className="mr-1 mt-0.5" size={16} />
      {children}
    </Button>
  );
}
