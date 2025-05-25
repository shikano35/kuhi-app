import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Layout } from '@/layouts';
import { baseMetadata } from '@/lib/metadata';
import { TanstackProvider } from '@/components/Providers/TanstackProvider';
import { MswScript } from '@/components/Providers/MswScript';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {process.env.NODE_ENV === 'development' && <MswScript />}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <Layout>{children}</Layout>
        </TanstackProvider>
      </body>
    </html>
  );
}
