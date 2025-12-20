import { ExternalLink } from 'lucide-react';

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-8 text-primary/80">
      <p className="font-serif-reading text-sm leading-relaxed">
        以下は、くひめぐり（以下「当サイト」）における、利用者の個人情報およびアクセスデータの取り扱いについて定めるものです。
      </p>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          1. 収集する情報
        </h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトでは、Google LLC が提供する Google Analytics
          4（GA4）を使用し、利用者のアクセス情報を収集しています。収集される情報には、アクセスしたページ、クリックや画面遷移などの行動データ、利用しているデバイス・ブラウザ情報、自動的に匿名化処理されたIPアドレス、Cookieによるトラッキング情報が含まれます。
          <br />
          <strong>これらのデータは個人を特定するものではありません。</strong>
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">2. 利用目的</h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          取得した情報は、サイトの利用状況の把握、コンテンツ・UIの改善、サイト品質向上のための統計分析、および句碑データ利活用に関する研究の目的で利用します。
          <br />
          取得したデータを個人識別や第三者の不利益となる目的で利用することはありません。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          3. Cookieの使用
        </h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトでは、Google Analytics により Cookieを使用しています。
          <br />
          ブラウザ設定により
          Cookieの使用を拒否することができます。当サイトはCookieを無効化しても閲覧可能です。
        </p>
        <h3 className="mt-4 mb-1 text-sm font-semibold text-primary">
          Cookie を無効化する例（Chrome の場合）
        </h3>
        <p className="font-serif-reading mt-2 text-sm leading-relaxed">
          「設定」→「プライバシーとセキュリティ」→「サードパーティ
          Cookie」から設定できます。 その他のブラウザでも同様に、設定画面から
          Cookie の制御が可能です。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          4. 第三者提供
        </h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトは、法令に基づき開示が必要となる場合、利用者本人の同意がある場合、業務委託に必要な範囲を除き、取得した情報を第三者へ提供することはありません。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          5. 外部サービスへのデータ送信
        </h2>
        <p className="font-serif-reading mb-2 text-sm leading-relaxed">
          GA4 はアクセスデータを Google のサーバへ送信します。これは Google
          Analytics 利用規約に基づき適切に処理されます。当サイトは
          IP匿名化機能を有効化し、個人が特定されない形での送信を行っています。Google
          によるデータの利用方法については、Google
          のプライバシーポリシーおよび利用規約をご確認ください。
        </p>
        <a
          aria-label="Google のデータ利用について（新しいタブで開く）"
          className="inline-flex items-center gap-1 text-sm text-emerald-700 underline underline-offset-3 hover:text-emerald-900"
          href="https://policies.google.com/technologies/partner-sites"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google のデータ利用について
          <ExternalLink className="h-3 w-3" />
        </a>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">6. 著作権</h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトで掲載している画像・文章・その他のコンテンツの著作権は、各権利者に帰属します。
          権利を侵害する意図は一切ございません。
          掲載内容に問題がございましたら、お手数ですが権利者ご本人よりお問い合わせフォームへご連絡ください。確認のうえ、速やかに対応いたします。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          7. プライバシーポリシーの変更
        </h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトは、法令の改正やサービス内容の変更に伴い、本プライバシーポリシーを予告なく変更することがあります。変更後の内容は当サイトに掲載した時点で効力を生じるものとします。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">8. 免責事項</h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          当サイトからリンクやバナー等によって外部サイトへ移動した場合、移動先で提供される情報、サービス等について当サイトは一切の責任を負いません。
          <br />
          当サイトのコンテンツについては、細心の注意を払って作成しておりますが、その正確性・安全性・有用性等について一切保証するものではありません。利用者ご自身の責任においてご利用ください。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          9. お問い合わせ
        </h2>
        <p className="font-serif-reading text-sm leading-relaxed">
          本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
        </p>
      </section>

      <div className="border-t border-border pt-4">
        <p className="font-serif-reading text-xs text-muted-foreground">
          初出掲載日: 2025年12月11日
          <br />
          最終更新日: 2025年12月11日
        </p>
      </div>
    </div>
  );
}
