'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type BackButtonProps = {
  fallbackUrl?: string;
  children: React.ReactNode;
};

export function BackButton({
  fallbackUrl = '/poets',
  children,
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
      className="mb-6 hover:bg-input flex items-center text-lg text-primary hover:text-primary/80"
      onClick={handleBackClick}
      variant="ghost"
    >
      <ArrowLeft className="mr-1 mt-0.5" size={16} />
      {children}
    </Button>
  );
}
