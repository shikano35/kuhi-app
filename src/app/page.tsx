import { HeroSection } from '@/components/Home/Hero';
import { TodaysHaikuSection } from '@/components/Home/TodaysHaiku';
import { RegionalHaikuContainer } from '@/components/Home/RegionalHaikuContainer';
import { PickupSection } from '@/components/Home/PickupSection';
import { SearchSection } from '@/components/Home/Search';
import { PoetContainer } from '@/components/Home/PoetContainer';
import { HistorySection } from '@/components/Home/History';
import { OtherSection } from '@/components/Home/Other';
import { HomeHeader } from '@/layouts/Header';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <HomeHeader />
      <HeroSection />
      <RegionalHaikuContainer />
      <PoetContainer />
      <SearchSection />
      <TodaysHaikuSection />
      <PickupSection />
      <HistorySection />
      <OtherSection />
    </main>
  );
}
