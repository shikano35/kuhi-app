'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <Button
      aria-label="前のページに戻る"
      className="w-full sm:w-auto"
      onClick={() => window.history.back()}
      size="lg"
      variant="outline"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      戻る
    </Button>
  );
}
