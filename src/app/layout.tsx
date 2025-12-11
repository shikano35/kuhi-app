import { Shippori_Mincho, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import { Layout } from '@/layouts';
import { baseMetadata } from '@/lib/metadata';
import { TanstackProvider } from '@/components/Providers/TanstackProvider';
import AuthProvider from '@/components/Providers/AuthProvider';
import { MswScript } from '@/components/Providers/MswScript';

const GA_MEASUREMENT_ID = 'G-ZQVEQSTMJQ';

const shipporiMincho = Shippori_Mincho({
  variable: '--font-shippori-mincho',
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      {process.env.NODE_ENV === 'development' && <MswScript />}
      <body
        className={`${shipporiMincho.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
