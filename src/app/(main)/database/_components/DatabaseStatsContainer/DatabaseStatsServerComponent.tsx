import Link from 'next/link';
import { getFullMonumentDataset } from '@/lib/monument-dataset';
import { buildMonumentStats, type Ranked } from '@/lib/monument-stats';
import { DataDownloadButton } from '@/components/shared/DataDownloadButton';

const numberFormat = new Intl.NumberFormat('ja-JP');
const percentFormat = new Intl.NumberFormat('ja-JP', {
  style: 'percent',
  maximumFractionDigits: 0,
});

function Card({
  title,
  lead,
  children,
}: {
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-card border border-border/70 p-7">
      <h3 className="font-shippori-mincho text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
        {lead}
      </p>
      {children}
    </section>
  );
}

function Bars({ items, total }: { items: Ranked[]; total: number }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => {
        const share = total === 0 ? 0 : item.count / total;
        return (
          <li key={item.name}>
            <div className="flex justify-between items-baseline gap-4 mb-2">
              <span className="text-sm">{item.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                {numberFormat.format(item.count)}基
                <span className="ml-2">{percentFormat.format(share)}</span>
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/70 rounded-full"
                style={{ width: `${Math.max(share * 100, 1)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export async function DatabaseStatsServerComponent() {
  const stats = buildMonumentStats(await getFullMonumentDataset());

  const updatedAt = stats.lastUpdated?.slice(0, 10).replace(/-/g, '.');
  const postwar = stats.periods.find((period) =>
    period.label.startsWith('戦後')
  );

  const figures = [
    { value: numberFormat.format(stats.total), unit: '基', label: '句碑数' },
    {
      value: numberFormat.format(stats.sourceCount),
      unit: '件',
      label: '参考資料',
    },
    { value: updatedAt ?? '—', unit: '', label: '最終更新' },
  ];

  return (
    <div className="space-y-20">
      <section className="rounded-3xl bg-muted/50 px-6 py-14 sm:px-12 text-center">
        <h2 className="font-shippori-mincho text-2xl sm:text-3xl mb-5">
          データのダウンロード
        </h2>
        <p className="text-muted-foreground mb-10">
          句碑データをCSVまたはJSONL形式で取得できます。
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <DataDownloadButton format="csv" size="lg" variant="default" />
          <DataDownloadButton format="jsonl" size="lg" variant="outline" />
        </div>

        <dl className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto">
          {figures.map((figure) => (
            <div
              className="rounded-2xl bg-background/80 border border-border/60 px-3 py-6"
              key={figure.label}
            >
              <dd className="font-shippori-mincho text-2xl sm:text-3xl tabular-nums">
                {figure.value}
                {figure.unit && (
                  <span className="text-sm ml-0.5">{figure.unit}</span>
                )}
              </dd>
              <dt className="text-xs text-muted-foreground mt-2">
                {figure.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="font-shippori-mincho text-2xl text-center mb-10">
          収録の内訳
        </h2>
        <div className="grid lg:grid-cols-2 gap-5">
          <Card lead="都道府県別の句碑の内訳です。" title="地域別">
            <Bars items={stats.topPrefectures} total={stats.total} />
          </Card>

          <Card
            lead={
              postwar && stats.withEstablishedYear > 0 ? (
                <>
                  判明している{numberFormat.format(stats.withEstablishedYear)}
                  基のうち、
                  {percentFormat.format(
                    postwar.count / stats.withEstablishedYear
                  )}
                  が戦後の建立です。
                  <br />
                  最も古いものは{stats.oldestEstablishedYear}年の建立です。
                </>
              ) : (
                '建立年が判明している句碑の内訳です。'
              )
            }
            title="建立年"
          >
            <Bars
              items={stats.periods.map((period) => ({
                name: period.label,
                count: period.count,
                share: 0,
              }))}
              total={stats.withEstablishedYear}
            />
          </Card>

          <Card lead="俳句が刻まれている俳人の内訳です。" title="俳人別">
            <Bars items={stats.topPoets} total={stats.total} />
          </Card>

          <Card
            lead={`${numberFormat.format(stats.sourceCount)}件の資料をもとにしています。`}
            title="主な出典"
          >
            <ol className="space-y-4">
              {stats.topSources.slice(0, 5).map((source) => (
                <li
                  className="flex gap-4 justify-between items-baseline text-sm"
                  key={source.citation}
                >
                  {source.url ? (
                    <a
                      className="underline underline-offset-4 decoration-border hover:decoration-foreground"
                      href={source.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.citation}
                    </a>
                  ) : (
                    <span>{source.citation}</span>
                  )}
                  <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                    {numberFormat.format(source.count)}基
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-7 text-sm">
              <Link
                className="underline underline-offset-4 decoration-border hover:decoration-foreground"
                href="/references"
              >
                出典の一覧をすべて見る
              </Link>
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
