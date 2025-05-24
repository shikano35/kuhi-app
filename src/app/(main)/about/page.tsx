import Image from 'next/image';
import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '句碑とは | くひめぐり',
  description: '句碑の歴史や意義、特徴について解説しています。',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">句碑とは</h1>
      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の概要
          </h2>
          <div className="mb-6 relative h-64 w-full">
            <Image
              alt="句碑の例"
              className="object-cover rounded-lg shadow-md"
              fill
              src="/images/kuhi-example.jpg"
            />
          </div>
          <p className="mb-4 text-lg">
            句碑（くひ）とは、俳句や俳諧などの作品を石などに刻んで建立した記念碑のことです。
            俳人が詠んだ俳句や、その地域に縁のある句を末永く残すために建てられています。
          </p>
          <p className="mb-4 text-lg">
            句碑は日本各地に数多く存在し、その地域の文化や歴史を物語る貴重な文化遺産となっています。
            多くの場合、寺院や名所旧跡、俳人ゆかりの地などに建立されています。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の歴史
          </h2>
          <p className="mb-4 text-lg">
            句碑の歴史は古く、江戸時代中期頃から建立が始まったとされています。
            特に松尾芭蕉の「奥の細道」の旅の足跡をたどる形で、多くの句碑が建立されました。
          </p>
          <p className="mb-4 text-lg">
            明治時代以降、正岡子規によって近代俳句が確立されると、さまざまな俳人の句碑が日本各地に建てられるようになりました。
            現在では、地域の文化振興や観光資源として、新たな句碑が建立されることも多くなっています。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-medium mb-2">素材と形状</h3>
              <p className="text-primary">
                多くの句碑は石材（主に花崗岩や大理石など）で作られていますが、木製や金属製のものも存在します。
                形状は直方体や自然石を活かした不定形なものなど様々で、俳句が刻まれた面は平らに加工されています。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">刻字と配置</h3>
              <p className="text-primary">
                句碑には主に縦書きで俳句が刻まれていますが、横書きのものや、石の形状に合わせた配置のものもあります。
                多くの場合、俳句と俳人名、建立年月日や建立者なども刻まれています。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-2">建立場所</h3>
              <p className="text-primary">
                俳句にゆかりのある場所や、その句が詠まれた景観を眺められる場所などに建立されることが多いです。
                寺社仏閣の境内や公園、山頂や河川敷など、様々な場所に見られます。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">保存と管理</h3>
              <p className="text-primary">
                句碑は地域の文化財として、地方自治体や保存会によって管理されることが多いです。
                中には国の重要文化財や史跡に指定されている句碑もあります。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            代表的な句碑
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <span className="font-medium">「古池や蛙飛び込む水の音」</span> -
              松尾芭蕉（東京都文京区の深川芭蕉庵跡）
            </li>
            <li>
              <span className="font-medium">「閑さや岩にしみ入る蝉の声」</span>{' '}
              - 松尾芭蕉（岩手県平泉町の中尊寺）
            </li>
            <li>
              <span className="font-medium">
                「柿くへば鐘が鳴るなり法隆寺」
              </span>{' '}
              - 正岡子規（奈良県斑鳩町の法隆寺）
            </li>
            <li>
              <span className="font-medium">「菜の花や月は東に日は西に」</span>{' '}
              - 与謝蕪村（京都府京都市の蕪村旧跡）
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の価値と意義
          </h2>
          <p className="mb-4 text-lg">
            句碑は単なる石碑ではなく、日本の文学や文化を後世に伝える貴重な文化遺産です。
            また、地域の歴史や風土を物語る重要な資料としても価値があります。
          </p>
          <p className="mb-4 text-lg">
            近年では、句碑を巡る「句碑めぐり」や「俳句の道」として観光資源化され、
            地域振興や伝統文化の普及に一役買っています。
          </p>
          <p className="text-lg">
            当サイトでは、こうした句碑の情報を収集・整理し、多くの方々に知っていただくことを目的としています。
            句碑を通じて、日本の豊かな俳句文化に触れていただければ幸いです。
          </p>
        </section>
      </div>
    </div>
  );
}
