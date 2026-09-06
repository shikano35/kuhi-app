'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDownIcon } from 'lucide-react';

const questions: { q: string; a: React.ReactNode }[] = [
  {
    q: 'どのような資料をもとにしていますか',
    a: (
      <>
        自治体や図書館・博物館、民間団体が公開している資料をもとにしています。また、お問い合わせいただいた情報や個人的に収集した情報についても、事実確認のうえ追加しています。
        <br />
        句碑ごとに出典を記録しており、一覧は
        <Link
          className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
          href="/references"
        >
          関連文献・参考文献
        </Link>
        でご覧いただけます。
      </>
    ),
  },
  {
    q: '収録されている地域に差があるのはなぜですか',
    a: '句碑の情報は県や市区町村の単位で公開されていることが多く、資料を確認できた地域から収録しているためです。',
  },
  {
    q: 'データを自由に使えますか',
    a: (
      <>
        所在地や緯度経度、建立年といった事実にあたる情報は、自由にご利用いただけます。
        <br />
        当サイトへの出典の表示は必須ではありません。
        <br />
        ただし、もとの資料には出典の表示を条件としているものや、転載を許諾していないものがあります。
        <br />
        解説文や写真を転載・再配布される場合は、データに含まれる出典元の条件をご確認ください。
      </>
    ),
  },
  {
    q: 'どのくらいの頻度で更新されますか',
    a: '決まった更新日はなく、資料を確認できたものから随時追加しています。',
  },
  {
    q: 'Webサイトやアプリケーションで使用できますか',
    a: (
      <>
        使用できます。
        <br />
        REST APIと
        <a
          className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
          href="https://github.com/shikano35/kuhi-api-mcp-server"
          rel="noopener noreferrer"
          target="_blank"
        >
          MCPサーバー
        </a>
        を公開しています。仕様は
        <a
          className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
          href="https://developers.kuhi.jp"
          rel="noopener noreferrer"
          target="_blank"
        >
          APIドキュメント
        </a>
        をご覧ください。
      </>
    ),
  },
  {
    q: '当サイトに掲載されていない句碑を知っています',
    a: (
      <>
        <Link
          className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
          href="/contribute"
        >
          句碑の情報提供フォーム
        </Link>
        からお寄せください。
        <br />
        収録内容の誤りについては、
        <Link
          className="underline underline-offset-4 hover:text-primary transition-colors duration-200"
          href="/contact"
        >
          お問い合わせ
        </Link>
        からご連絡ください。 事実確認の上、必要に応じて修正します。
      </>
    ),
  },
];

export function DatabaseFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const transition = {
    duration: shouldReduceMotion ? 0 : 0.28,
    ease: 'easeInOut' as const,
  };

  return (
    <ul className="divide-y divide-border/70 border-y border-border/70">
      {questions.map(({ q, a }, index) => {
        const isOpen = openIndex === index;

        return (
          <li key={q}>
            <h3>
              <button
                aria-controls={`faq-answer-${index}`}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-5 text-left cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span className="font-shippori-mincho text-lg">{q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="shrink-0 text-muted-foreground"
                  transition={transition}
                >
                  <ChevronDownIcon aria-hidden className="size-5" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  animate={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  key={`answer-${q}`}
                  transition={transition}
                >
                  <p className="pb-6 pr-11 text-muted-foreground leading-relaxed">
                    {a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
