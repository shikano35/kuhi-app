import Image from 'next/image';

const HISTORY_EVENTS = [
  {
    year: '平安・室町期',
    title: '短歌から連歌へ',
    description:
      '平安時代には貴族文化として短歌（５・７・５・７・７）が盛んであったが、室町期になるとこれを二人以上で詠み継ぐ連歌が庶民にも流行した。連歌の冒頭部分「発句（５・７・５）」が独立して注目され始め、洒落や言葉遊びを交えた「俳諧」が生まれる ',
    image: '/images/history/basho.jpg',
  },
  {
    year: '江戸時代',
    title: '発句の芸術化',
    description:
      '松尾芭蕉（1644-1694）や与謝蕪村、小林一茶らが「蕉風」「蕪風」「一茶風」と呼ばれる作風を打ち立て、発句を芸術として高めた。この頃から「発句」に季語を必ず入れる慣習が定着し、俳諧の中心としての地位を確立する。',
    image: '/images/history/basho-memorial.jpg',
  },
  {
    year: '明治以降',
    title: '正岡子規と俳句革新',
    description:
      '明治時代に正岡子規（1867-1902）らが「俳句革新運動」を起こし、従来の俳諧から「俳句」という名称・短詩型文芸としての確立を推進した。これにより俳句は出版メディアや全国の句会を通して一気に普及し、現代につながる日本を代表する短詩型文学となる。',
    image: '/images/history/buson.jpg',
  },
  {
    year: '近代',
    title: '海外普及と第二芸術論',
    description:
      '昭和期には桑原武夫らの「第二芸術論」をめぐる激論が展開される一方、俳句のシンプルさが海外で評価され、国際的にも短詩型文学として定着していった。',
    image: '/images/history/shiki.jpg',
  },
];

export function HistorySection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          俳句と句碑の歴史
        </h2>

        <div className="relative">
          <div className="relative z-10">
            {HISTORY_EVENTS.map((event, index) => (
              <div
                className={`mb-32 flex items-center ${
                  index % 2 === 0
                    ? 'justify-start'
                    : 'flex-row-reverse justify-start'
                }`}
                key={event.year}
              >
                <div
                  className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}
                >
                  <h3 className="text-2xl font-semibold">{event.year}</h3>
                  <h4 className="text-xl font-medium mt-1">{event.title}</h4>
                  <p className="mt-2 text-gray-600 text-start">
                    {event.description}
                  </p>
                </div>

                <div className="relative z-20 flex items-center justify-center w-12 h-12 rounded-full bg-primary border-4 border-white">
                  <span className="text-white font-semibold">
                    {event.year.slice(0, 2)}
                  </span>
                </div>

                <div className={`w-5/12 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-md">
                    <Image
                      alt={event.title}
                      className="object-cover"
                      fill
                      src={event.image || `/images/placeholder-history.jpg`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
