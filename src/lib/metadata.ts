import type { Metadata } from 'next';

export const baseMetadata: Metadata = {
  title: 'くひめぐり - Haiku monument tour -',
  description: '日本各地の句碑を紹介するサイト',
  keywords: 'くひめぐり,haiku,monument,句碑,句碑アプリ,俳句,句碑巡り',
  generator: 'くひめぐり',
  applicationName: 'くひめぐり',
  openGraph: {
    title: 'くひめぐり - Haiku monument tour -',
    description: '日本各地の句碑を紹介するサイト',
    type: 'website',
    url: 'https://kuhi.jp',
    siteName: 'くひめぐり',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://kuhi.jp',
        width: 1200,
        height: 630,
        alt: 'くひめぐり',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'くひめぐり - Haiku monument tour -',
    description: '日本各地の句碑を紹介するサイト',
  },
};
