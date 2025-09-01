import Image from 'next/image';
import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import Link from 'next/link';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'このサイトについて | くひめぐり',
  description:
    '句碑とは何か、句碑めぐりサイトの目的や使い方について解説しています。',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">句碑とは</h1>
      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑とは
          </h2>
          <div className="mb-6 relative h-64 w-full">
            <Image
              alt="句碑の例"
              className="object-cover rounded-lg shadow-md"
              fill
              src="/images/kuhi-example.webp"
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
              <span className="font-medium">「夏草や兵どもが夢の跡」</span> -
              松尾芭蕉（岩手県平泉町の毛越寺南大門跡）
            </li>
            <li>
              <span className="font-medium">
                「柿くへば鐘が鳴るなり法隆寺」
              </span>{' '}
              - 正岡子規（奈良県斑鳩町の法隆寺）
            </li>
            <li>
              <span className="font-medium">「菜の花や月は東に日は西に」</span>{' '}
              - 与謝蕪村（大阪府大阪市北区の梅田芸術劇場前）
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
          <p className="text-lg">
            近年では、句碑を巡る「句碑めぐり」や「俳句の道」として観光資源化され、
            地域振興や伝統文化の普及に一役買っています。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            「くひめぐり」とは
          </h2>
          <div className="mb-6 relative h-64 w-full">
            <Image
              alt="くひめぐりアプリのイメージ"
              className="object-cover rounded-lg shadow-md"
              fill
              src="/images/kuhi-app.webp"
            />
          </div>
          <p className="mb-4 text-lg">
            「くひめぐり」は、日本全国に点在する句碑を簡単に検索し、めぐることができるWebアプリケーションです。
            俳句文化の保存と普及を目的に、句碑の位置情報や解説、関連する俳人の情報などを提供しています。
          </p>
          <p className="mb-4 text-lg">
            当サイトを通じて、より多くの方々に日本の伝統文化である俳句に親しんでいただき、
            実際に句碑をめぐる旅の計画にお役立ていただければ幸いです。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            サイトの使い方
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">句碑を探す</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  地図から探す - 地図上のマーカーをクリックして句碑情報を閲覧
                </li>
                <li>一覧から探す - 検索やフィルターで条件に合った句碑を検索</li>
                <li>俳人から探す - 特定の俳人に関連する句碑をまとめて閲覧</li>
              </ul>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">
                アカウント機能（準備中）
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>お気に入り登録 - 気になる句碑をブックマーク</li>
                <li>訪問記録 - 訪れた句碑を記録して思い出を残す</li>
                <li>句碑情報の投稿 - 新しい句碑情報の追加や修正の提案</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            利用規約・プライバシーポリシー
          </h2>
          <p className="mb-4 text-lg">
            当サイトのご利用にあたっては、以下の規約およびプライバシーポリシーに同意いただいたものとみなします。
            詳細については各リンク先をご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              className="inline-flex items-center justify-center px-6 py-3 border border-primary rounded-md font-medium text-primary hover:bg-primary hover:text-white transition-colors"
              href="/"
            >
              利用規約を見る
            </Link>
            <Link
              className="inline-flex items-center justify-center px-6 py-3 border border-primary rounded-md font-medium text-primary hover:bg-primary hover:text-white transition-colors"
              href="/"
            >
              プライバシーポリシーを見る
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            お問い合わせ
          </h2>
          <p className="mb-4 text-lg">
            ご意見・ご要望・お問い合わせなどございましたら、以下のフォームよりご連絡ください。
          </p>
          <Link
            className="inline-flex items-center justify-center px-6 py-3 bg-primary rounded-md font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            href="/"
          >
            お問い合わせフォームへ
          </Link>
        </section>
      </div>
    </div>
  );
}
