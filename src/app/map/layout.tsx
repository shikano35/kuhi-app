import { TanstackProvider } from '@/components/Providers/TanstackProvider';
import { MapHeader } from '@/layouts/Header';
import { baseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '句碑マップ | くひめぐり',
  description:
    '句碑の位置をマップ上で確認できます．また，地域や俳人などでフィルターして探すことができます．',
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col fixed inset-0">
      <div className="flex-none z-50">
        <MapHeader />
      </div>
      <div className="flex-1 overflow-hidden">
        <TanstackProvider>{children}</TanstackProvider>
      </div>
    </div>
  );
}
