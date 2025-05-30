'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

type MenuDropdownProps = {
  isVisible: boolean;
};

export function MenuDropdown({ isVisible }: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      className="block md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="bg-background border border-border rounded-t-lg shadow-lg">
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2 hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm font-medium">検索オプション</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="border-t border-border">
            <div className="grid grid-cols-3 divide-x divide-border">
              <Link
                className="px-4 py-3 text-center hover:bg-muted transition-colors"
                href="/list"
              >
                <div className="text-sm font-medium">句碑</div>
                <div className="text-xs text-muted-foreground">句碑を検索</div>
              </Link>
              <Link
                className="px-4 py-3 text-center hover:bg-muted transition-colors"
                href="/haiku"
              >
                <div className="text-sm font-medium">俳句</div>
                <div className="text-xs text-muted-foreground">俳句を検索</div>
              </Link>
              <Link
                className="px-4 py-3 text-center hover:bg-muted transition-colors"
                href="/poets"
              >
                <div className="text-sm font-medium">俳人</div>
                <div className="text-xs text-muted-foreground">俳人を検索</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
