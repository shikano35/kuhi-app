import { HeroSection } from '@/components/Home/Hero';
import { RegionalHaikuSection } from '@/components/Home/RegionalHaiku';
import { SearchSection } from '@/components/Home/Search';
import { PoetSection } from '@/components/Home/Poet';
import { HistorySection } from '@/components/Home/History';
import { OtherSection } from '@/components/Home/Other';
import { HomeHeader } from '@/layouts/Header';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <HomeHeader />
      <HeroSection />
      <RegionalHaikuSection />
      <PoetSection />
      <SearchSection />
      <HistorySection />
      <OtherSection />
    </main>
  );
}
