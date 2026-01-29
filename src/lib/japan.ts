export const PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
] as const;

export type Prefecture = (typeof PREFECTURES)[number];

export const REGIONS = [
  '北海道',
  '東北',
  '関東甲信',
  '東海',
  '北陸',
  '近畿',
  '中国',
  '四国',
  '九州',
  '沖縄',
] as const;

export type Region = (typeof REGIONS)[number];

export const PREFECTURE_ORDER: Record<string, number> = Object.fromEntries(
  PREFECTURES.map((pref, index) => [pref, index])
);

export function sortPrefectures(prefectures: string[]): string[] {
  return [...prefectures].sort((a, b) => {
    const orderA = PREFECTURE_ORDER[a] ?? 999;
    const orderB = PREFECTURE_ORDER[b] ?? 999;
    return orderA - orderB;
  });
}

export function sortPoetNames(names: string[]): string[] {
  return [...names].sort((a, b) => a.localeCompare(b, 'ja'));
}
