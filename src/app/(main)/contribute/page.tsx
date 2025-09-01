import { Info } from 'lucide-react';
import { Metadata } from 'next';

const googleform = process.env.GOOGLE_FORM_URL;

export const metadata: Metadata = {
  title: '句碑の情報をお持ちの方へ | くひめぐり',
  description:
    '未掲載の句碑情報をお持ちの方は、このフォームから情報をご提供ください。写真や位置情報など、詳細な情報をお待ちしております。',
};

export default function ContributePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        句碑の情報をお持ちの方へ
      </h1>
      <div className="max-w-3xl mx-auto mb-8">
        <p className="mb-4">
          当サイトでは、日本各地の句碑情報を収集・公開しています。しかし、まだ掲載されていない句碑は数多く存在します。
          未掲載の句碑情報をお持ちの方は、ぜひ下記のフォームからご連絡ください。
        </p>
        <p className="mb-6">
          写真や正確な位置情報（住所や緯度・経度）、俳句の内容、建立年などの情報があれば、より正確なデータベース構築に役立ちます。
          みなさまのご協力をお願いいたします。
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="size-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                ご提供いただいた情報は、当サイト運営者によって確認を行った上で公開させていただきます。
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <a
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            href={googleform}
            rel="noopener noreferrer"
            target="_blank"
          >
            Googleフォームで情報を提供する
          </a>
        </div>
      </div>
      {/* <ContributeForm /> */}
    </div>
  );
}
