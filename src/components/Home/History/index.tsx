'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { HaikuHistoryChart } from './HaikuHistoryChart';

type HistoryEvent = {
  id: number;
  year: string;
  era: string;
  title: string;
  description: string;
  image: string;
  keyFigures?: string[];
};

const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: 1,
    year: '平安・室町期',
    era: '794-1573',
    title: '短歌から連歌へ',
    description:
      '平安時代には貴族文化として短歌（5・7・5・7・7）が盛んでしたが、室町期には連歌が庶民にも広がり、発句（5・7・5）が独立して注目を浴び「俳諧」が生まれました。',
    image: '/images/1.webp',
    keyFigures: ['藤原定家', '心敬', '山崎宗鑑', '荒木田守武'],
  },
  {
    id: 2,
    year: '江戸時代',
    era: '1603-1868',
    title: '発句の芸術化',
    description:
      '芭蕉や蕪村、一茶らが季語を重視し、発句を芸術として高めた時代です。俳諧の中核として確立し、今に続く形式を完成させました。',
    image: '/images/2.webp',
    keyFigures: ['松尾芭蕉', '与謝蕪村', '小林一茶'],
  },
  {
    id: 3,
    year: '明治以降',
    era: '1868-1945',
    title: '子規と俳句革新',
    description:
      '正岡子規らが俳句革新運動を推進し、俳句はメディアと句会を通じて全国に普及。現代俳句の基礎が築かれました。',
    image: '/images/3.webp',
    keyFigures: ['正岡子規', '高浜虚子', '種田山頭火'],
  },
  {
    id: 4,
    year: '近代',
    era: '1945-現在',
    title: '海外普及・第二芸術論',
    description:
      '昭和期の第二芸術論を経て、俳句は海外でも短詩型文学として評価され、国際的に親しまれるようになりました。',
    image: '/images/4.webp',
    keyFigures: ['桑原武夫', '金子兜太', '山口誓子'],
  },
];

export function HistorySection() {
  return (
    <section
      aria-labelledby="history-heading"
      className="py-24 px-4 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden"
      role="region"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent"
            id="history-heading"
          >
            俳句と句碑の歴史
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            1000年以上の歴史を持つ俳句の変遷と、その文化を刻む句碑の物語をたどります。
          </p>
        </div>

        <div className="mb-32">
          <HaikuHistoryChart />
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-purple-500 to-blue-500 hidden md:block" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

          {HISTORY_EVENTS.map((event, index) => (
            <article
              aria-labelledby={`event-${event.id}-title`}
              className={`relative mb-24 md:mb-32 ${
                index % 2 === 0
                  ? 'md:flex md:justify-start'
                  : 'md:flex md:flex-row-reverse md:justify-start'
              }`}
              key={event.id}
              role="article"
            >
              <div className="hidden md:block md:w-5/12">
                <div
                  className={`${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}
                >
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="text-2xl lg:text-3xl font-bold text-primary">
                      {event.year}
                    </span>
                    <span className="text-xs lg:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {event.era}
                    </span>
                  </div>

                  <h3
                    className="text-xl lg:text-2xl font-bold mb-4 text-foreground"
                    id={`event-${event.id}-title`}
                  >
                    {event.title}
                  </h3>

                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-6 text-left">
                    {event.description}
                  </p>

                  {event.keyFigures && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-primary mb-2">
                        重要人物
                      </h4>
                      <div
                        className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        {event.keyFigures.map((figure, figureIndex) => (
                          <span
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            key={figureIndex}
                          >
                            {figure}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:flex md:items-center md:justify-center md:w-16 md:h-16 md:relative md:z-20">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 border-4 border-background shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-bold text-sm">
                    {event.year.slice(0, 2)}
                  </span>
                </motion.div>
              </div>

              <div className="hidden md:block md:w-5/12">
                <div className={`${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <motion.div
                    className="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl group"
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      alt={`${event.title}の時代を表現した歴史的イメージ`}
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={event.image || '/images/default.png'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  </motion.div>
                </div>
              </div>

              <div className="md:hidden">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
                    <Image
                      alt={`${event.title}の時代を表現した歴史的イメージ`}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={event.image || '/images/default.png'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-primary">
                        {event.year}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {event.era}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-bold text-foreground"
                      id={`mobile-event-${event.id}-title`}
                    >
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>

                    {event.keyFigures && (
                      <div>
                        <h4 className="text-sm font-semibold text-primary mb-2">
                          重要人物
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {event.keyFigures.map((figure, figureIndex) => (
                            <span
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              key={figureIndex}
                            >
                              {figure}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
