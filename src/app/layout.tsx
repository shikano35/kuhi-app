import { Klee_One, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Layout } from '@/layouts';
import { baseMetadata } from '@/lib/metadata';
import { TanstackProvider } from '@/components/Providers/TanstackProvider';
import AuthProvider from '@/components/Providers/AuthProvider';
import { MswScript } from '@/components/Providers/MswScript';

const kleeOne = Klee_One({
  variable: '--font-klee-one',
  weight: '600',
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
      <body className={`${kleeOne.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
