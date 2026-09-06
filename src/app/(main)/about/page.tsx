import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { PrivacyLinkButton } from '@/app/(main)/privacy/_components/PrivacyLinkButton';
import { SkeletonImage } from '@/components/shared/SkeletonImage';
import { notoSerifJP } from '@/lib/fonts-reading';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '句碑とは | くひめぐり',
  description:
    '句碑とは何か、句碑めぐりサイトの目的や使い方について解説しています。',
};

export default function AboutPage() {
  return (
    <div
      className={`${notoSerifJP.variable} font-serif-reading container mx-auto py-8 px-4`}
    >
      <h1 className="font-shippori-mincho text-4xl font-bold mb-8 text-center">
        句碑とは
      </h1>
      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑とは
          </h2>
          <SkeletonImage
            alt="句碑の例"
            className="object-cover rounded-lg shadow-md"
            containerClassName="mb-6 h-64 w-full"
            src="/images/kuhi-example.webp"
          />
          <p className="mb-4 text-lg">
            <ruby>
              句碑<rt>くひ</rt>
            </ruby>
            とは、俳句や俳諧などの作品を石などに刻んで建立した記念碑のことです。
            俳人が詠んだ俳句や、その地域に縁のある句を末永く残すために建てられています。
          </p>
          <p className="mb-4 text-lg">
            句碑は、寺社の境内や公園、名所旧跡、俳人ゆかりの地などに建てられています。
            その土地で詠まれた句や、その地に縁のある俳人の俳句が刻まれていることが多くあります。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の歴史
          </h2>
          <p className="mb-4 text-lg">
            当サイトが収録する句碑のうち、建立年が判明しているもので最も古いのは
            1743年（寛保3年）に建てられたものです。松尾芭蕉ゆかりの地には、
            その足跡をたどるように句碑が建てられてきました。
          </p>
          <p className="mb-4 text-lg">
            明治時代以降、正岡子規らによって近代俳句が確立されると、さまざまな俳人の句碑が各地に建てられるようになりました。
            当サイトのデータでは、建立年が判明している214基のうち約8割が1950年から1999年の間に建てられたものです。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-shippori-mincho text-xl font-medium mb-2">
                素材と形状
              </h3>
              <p className="text-primary">
                句碑の多くは石を用いて建てられます。加工した直方体のものから、
                自然石をそのまま活かした不定形のものまでさまざまで、俳句が刻まれる面は平らに整えられています。
              </p>
            </div>
            <div>
              <h3 className="font-shippori-mincho text-xl font-medium mb-2">
                刻字と配置
              </h3>
              <p className="text-primary">
                句碑には主に縦書きで俳句が刻まれていますが、横書きのものや、石の形状に合わせた配置のものもあります。
                多くの場合、俳句と俳人名、建立年月日や建立者なども刻まれています。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-shippori-mincho text-xl font-medium mb-2">
                建立場所
              </h3>
              <p className="text-primary">
                俳句にゆかりのある場所や、その句が詠まれた景観を眺められる場所などに建立されることが多いです。
                寺社仏閣の境内や公園、山頂や河川敷など、様々な場所に見られます。
              </p>
            </div>
            <div>
              <h3 className="font-shippori-mincho text-xl font-medium mb-2">
                保存と管理
              </h3>
              <p className="text-primary">
                句碑は、地方自治体や保存会、寺社などによって管理されているものが多く、
                地域の文化財として扱われています。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            代表的な句碑
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <span className="font-shippori-mincho font-medium">
                「古池や蛙飛び込む水の音」
              </span>{' '}
              - 松尾芭蕉（東京都江東区 深川芭蕉庵跡）
            </li>
            <li>
              <span className="font-shippori-mincho font-medium">
                「夏草や兵どもが夢の跡」
              </span>{' '}
              - 松尾芭蕉（岩手県平泉町 毛越寺南大門跡）
            </li>
            <li>
              <span className="font-shippori-mincho font-medium">
                「柿くへば鐘が鳴るなり法隆寺」
              </span>{' '}
              - 正岡子規（奈良県斑鳩町 法隆寺）
            </li>
            <li>
              <span className="font-shippori-mincho font-medium">
                「菜の花や月は東に日は西に」
              </span>{' '}
              - 与謝蕪村（大阪府大阪市北区 梅田芸術劇場前）
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            句碑の価値と意義
          </h2>
          <p className="mb-4 text-lg">
            句碑には、俳句とあわせて建立の年や建立者が刻まれていることがあります。
            誰がいつ何のために建てたのかをたどると、その土地と俳句の関わりが見えてきます。
          </p>
          <p className="text-lg">
            当サイトでは、収録する句碑の緯度経度や写真を提示しています。
            地図や一覧から、実際に句碑を探すことができます。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            「くひめぐり」とは
          </h2>
          <SkeletonImage
            alt="くひめぐりのイメージ画像"
            className="object-cover rounded-lg shadow-md"
            containerClassName="mb-6 h-80 w-full"
            src="/images/kuhi-app.webp"
          />
          <p className="mb-4 text-lg">
            「くひめぐり」は、各地の句碑を検索し、地図や一覧からめぐることができるサイトです。
            句碑の所在地や碑文、関連する俳人の情報を掲載しています。
          </p>
          <p className="mb-4 text-lg">
            当サイトを通じて、俳句文化や日本文学に触れていただき、
            実際に句碑を訪れる旅のきっかけとなれば幸いです。
          </p>
          <p className="mb-4 text-lg">
            収録している句碑の件数や地域の偏り、出典、データのダウンロードについては
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/database"
            >
              このデータベースについて
            </Link>
            をご覧ください。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            サイトの使い方
          </h2>
          <div className="bg-muted/30 p-6 rounded-lg mb-6">
            <h3 className="font-shippori-mincho text-xl font-medium mb-3">
              句碑を探す
            </h3>
            <ul className="list-disc list-inside space-y-2 text-primary">
              <li>
                地図から探す - 地図上のマーカーをクリックして句碑情報を閲覧
              </li>
              <li>一覧から探す - 検索やフィルターで条件に合った句碑を検索</li>
              <li>俳人から探す - 特定の俳人に関連する句碑をまとめて閲覧</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            プライバシーポリシー
          </h2>
          <p className="mb-4 text-lg">
            当サイトにおける個人情報およびアクセスデータの取り扱いについては、
            プライバシーポリシーをご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <PrivacyLinkButton />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-shippori-mincho text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">
            お問い合わせ
          </h2>
          <p className="mb-4 text-lg">
            ご意見・ご要望・お問い合わせなどございましたら、以下のフォームよりご連絡ください。
          </p>
          <Link
            className="inline-flex items-center justify-center px-6 py-3 bg-primary rounded-md font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            href="/contact"
          >
            お問い合わせフォームへ
          </Link>
        </section>
      </div>
    </div>
  );
}
