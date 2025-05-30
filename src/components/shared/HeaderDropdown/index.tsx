'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

type HeaderDropdownProps = {
  trigger: React.ReactNode;
  items: Array<{
    href: string;
    label: string;
    description: string;
  }>;
};

export function HeaderDropdown({ trigger, items }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 75);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">{trigger}</div>

      {isOpen && (
        <>
          {/* より大きな透明ブリッジエリア */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-72 h-4 bg-transparent z-40" />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-4 z-50">
            <div className="w-64 bg-background border border-border rounded-lg shadow-lg py-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 divide-y divide-border">
                {items.map((item, index) => (
                  <Link
                    className="px-4 py-3 hover:bg-muted transition-colors block"
                    href={item.href}
                    key={index}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
