import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
