import type { Metadata } from 'next';

export const baseMetadata: Metadata = {
  title: 'くひめぐり｜日本全国の句碑データベース',
  description:
    '日本全国の句碑をデータベース化し、一覧・詳細・地図表示で紹介するサイト。',
  keywords: [
    'くひめぐり',
    '句碑',
    '句碑データベース',
    '句碑巡り',
    '俳句',
    'haiku',
    'monument',
    'kuhi',
  ],
  generator: 'くひめぐり',
  applicationName: 'くひめぐり',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://kuhi.jp',
    siteName: 'くひめぐり',
    title: 'くひめぐり｜日本全国の句碑データベース',
    description:
      '日本全国の句碑をデータベース化し、一覧・詳細・地図表示で紹介するサイト。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'くひめぐり｜日本全国の句碑データベース',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'くひめぐり｜日本全国の句碑データベース',
    description:
      '日本全国の句碑をデータベース化し、一覧・詳細・地図表示で紹介するサイト。',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
