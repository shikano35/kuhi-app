import { PrivacyPolicyContent } from '@/components/Privacy/PrivacyPolicyContent';
import { Container } from '@/components/Container';
import { baseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'プライバシーポリシー | くひめぐり',
  description: 'くひめぐりのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <main className="font-sans-reading min-h-screen bg-background py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-primary">
            プライバシーポリシー
          </h1>
          <div className="rounded-lg bg-background p-8 shadow-sm">
            <PrivacyPolicyContent />
          </div>
        </div>
      </Container>
    </main>
  );
}
