import {
  MessageSquarePlusIcon,
  MegaphoneIcon,
  BookOpenCheckIcon,
} from 'lucide-react';
import Link from 'next/link';

type LinkCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

function LinkCard({ title, description, href, icon }: LinkCardProps) {
  return (
    <Link className="block" href={href}>
      <div className="bg-background hover:bg-primary-foreground rounded-md px-6 py-12 transition h-full flex flex-col justify-center items-center">
        <div className="text-primary mb-8">{icon}</div>
        <h3 className="font-semibold text-xl mb-4">{title}</h3>
        <p className="text-muted-foreground grow">{description}</p>
      </div>
    </Link>
  );
}

export function OtherSection() {
  return (
    <section className="py-32 px-4 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
          その他コンテンツ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LinkCard
            description="句碑に関する書籍や論文、Webサイトなどの参考資料をまとめています。"
            href="/references"
            icon={<BookOpenCheckIcon className="w-10 h-10" />}
            title="関連文献・参考文献等"
          />

          <LinkCard
            description="未掲載の句碑や追加情報をお持ちの方は、こちらからご提供ください。"
            href="/contribute"
            icon={<MessageSquarePlusIcon className="w-10 h-10" />}
            title="句碑の情報をお持ちの方へ"
          />

          <LinkCard
            description="サイトの更新情報や句碑に関する最新のお知らせを掲載しています。"
            href="/news"
            icon={<MegaphoneIcon className="w-10 h-10" />}
            title="お知らせ一覧"
          />
        </div>
      </div>
    </section>
  );
}
