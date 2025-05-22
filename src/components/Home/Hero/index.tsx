import Image from 'next/image';

export function HeroSection() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          alt="句碑の背景"
          className="object-cover"
          fill
          priority
          src="/images/hero-bg.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 text-center grid grid-cols-1 md:grid-cols-2 text-white max-w-6xl px-4">
        <div className="col-span-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">くひめぐり</h1>
          <h2 className="text-lg md:text-xl mb-8">Haiku monument tour</h2>
          <p className="text-sm lg:text-base">
            くひめぐりは、日本全国の句碑についてまとめたサイトです。
            <br />
            句碑のに刻まれた俳句、所在地、句碑の写真などをまとめています。
          </p>
        </div>
      </div>
    </div>
  );
}
