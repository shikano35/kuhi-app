'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Book, MapPin, User } from 'lucide-react';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/list?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl  font-bold mb-6 text-primary">
            句碑を検索
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            キーワードや地域、俳人名から全国の句碑を検索できます。
          </p>

          <form className="mb-10" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border focus:border-primary"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="俳句のキーワード、俳人名、地名など"
                  type="text"
                  value={searchQuery}
                />
              </div>
              <button
                className="px-8 py-3 rounded-md bg-primary text-primary-foreground"
                type="submit"
              >
                検索
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <Link
              className="py-4 px-6 bg-background rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              href="/map"
            >
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">地域から探す</span>
            </Link>
            <Link
              className="py-4 px-6 bg-background rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              href="/poets"
            >
              <User className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">俳人から探す</span>
            </Link>
            <Link
              className="py-4 px-6 bg-background rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              href="/haiku"
            >
              <Book className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium">俳句から探す</span>
            </Link>
          </div>

          <Button asChild className="rounded-full px-8 py-6 text-base">
            <Link href="/map">句碑マップで見る</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
