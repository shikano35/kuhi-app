import Script from 'next/script';
import '../styles/globals.css';
import { Layout } from '@/layouts';
import { baseMetadata } from '@/lib/metadata';
import { shipporiMincho } from '@/lib/fonts';
import { TanstackProvider } from '@/components/Providers/TanstackProvider';

const GA_MEASUREMENT_ID = 'G-VSLEN6LFQ7';

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
      <body className={`${shipporiMincho.variable} antialiased`}>
        <TanstackProvider>
          <Layout>{children}</Layout>
        </TanstackProvider>
      </body>
    </html>
  );
}
