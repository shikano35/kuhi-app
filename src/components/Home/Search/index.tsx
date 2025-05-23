'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
          <h2 className="text-3xl font-bold mb-6 text-primary">句碑を検索</h2>
          <p className="text-lg text-muted-foreground mb-8">
            キーワードや地域、俳人名から全国の句碑を検索できます。
          </p>

          <form className="mb-10" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-1 focus:border-primary"
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
              href="/list?filter=region"
            >
              <svg
                className="h-8 w-8 text-primary mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="font-medium">地域から探す</span>
            </Link>
            <Link
              className="py-4 px-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              href="/list?filter=poet"
            >
              <svg
                className="h-8 w-8 text-primary mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="font-medium">俳人から探す</span>
            </Link>
            <Link
              className="py-4 px-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              href="/list?filter=haiku"
            >
              <svg
                className="h-8 w-8 text-primary mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
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
