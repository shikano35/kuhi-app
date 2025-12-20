import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ContactForm } from '@/components/Contact/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'くひめぐりへのお問い合わせフォームです。著作権・権利に関するお問い合わせ、誤りのご指摘、修正・追加のご提案を受け付けています。',
};

function ContactFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div className="space-y-2" key={i}>
          <div className="bg-muted h-4 w-24 rounded" />
          <div className="bg-muted h-10 w-full rounded" />
        </div>
      ))}
      <div className="bg-muted h-32 w-full rounded" />
      <div className="bg-muted h-10 w-full rounded" />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="font-noto-serif-jp mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">お問い合わせ</h1>
          <p className="text-primary">
            くひめぐりに関するお問い合わせは、以下のフォームよりお寄せください。
          </p>
        </div>

        <div className="bg-muted/50 mb-8 rounded-lg p-4">
          <ul className="text-primary space-y-1 text-sm">
            <li>
              ・
              著作権・権利に関するお問い合わせ、誤りのご指摘、修正・追加のご提案などを受け付けています
            </li>
            <li>・ 返信をご希望の場合は、メールアドレスをご入力ください</li>
            <li>
              ・
              内容や状況により、返信が難しい場合がございます。あらかじめご了承ください。
            </li>
          </ul>
        </div>

        <Suspense fallback={<ContactFormSkeleton />}>
          <ContactForm
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
          />
        </Suspense>
      </div>
    </Container>
  );
}
