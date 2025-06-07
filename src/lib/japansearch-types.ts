export interface JapanSearchItem {
  id: string;
  common: {
    title?: string;
    description?: string;
    creator?: string[];
    contributor?: string[];
    date?: string;
    type?: string;
    format?: string;
    subject?: string[];
    spatial?: string[];
    temporal?: string[];
    thumbnailUrl?: string | string[];
    landingPage?: string;
    database?: string;
    dataProvider?: string;
    linkUrl?: string;
    provider?: string;
    identifier?: string;
    language?: string | string[];
    rights?: string | string[];
  };
}

export interface JapanSearchResponse {
  list: JapanSearchItem[];
  hit: number;
}

export interface SearchParams {
  keyword?: string;
  size?: number;
  from?: number;
  'f-contents'?: string;
  'f-type'?: string;
  'f-spatial'?: string;
  'f-temporal'?: string;
}

/**
 * サムネイルURLを正規化
 */
export function normalizeThumbnailUrl(
  thumbnailUrl: string | string[] | undefined
): string | undefined {
  if (!thumbnailUrl) return undefined;

  if (Array.isArray(thumbnailUrl)) {
    return thumbnailUrl.length > 0 ? thumbnailUrl[0] : undefined;
  }

  return thumbnailUrl;
}

/**
 * 特定のフィールドパターンから値を抽出するヘルパー関数
 */
function extractFromDynamicFields(
  item: Record<string, unknown>,
  patterns: string[]
): string[] {
  const results: string[] = [];

  patterns.forEach((pattern) => {
    if (item[pattern] !== undefined) {
      const value = item[pattern];
      if (typeof value === 'string') {
        results.push(value);
      } else if (Array.isArray(value)) {
        results.push(...value.filter((v) => typeof v === 'string'));
      }
    }
  });

  if (results.length === 0) {
    Object.keys(item).forEach((key) => {
      if (patterns.some((pattern) => key.includes(pattern))) {
        const value = item[key];
        if (typeof value === 'string') {
          results.push(value);
        } else if (Array.isArray(value)) {
          results.push(...value.filter((v) => typeof v === 'string'));
        }
      }
    });
  }

  return results;
}

/**
 * 動的フィールドからタイトルを抽出
 */
function extractTitle(item: Record<string, unknown>): string | undefined {
  if (item.common && typeof item.common === 'object') {
    const common = item.common as Record<string, unknown>;
    if (common.title && typeof common.title === 'string') {
      return common.title;
    }
  }

  const titleFields = ['cobas-5-s', 'keioobjecthub-1-s', 'adeac-1-s', 'title'];

  const titles = extractFromDynamicFields(item, titleFields);

  if (titles.length > 0) {
    return titles.reduce((prev, current) =>
      current.length > prev.length ? current : prev
    );
  }

  return undefined;
}

/**
 * 動的フィールドから画像URLを抽出
 */
function extractImageUrl(item: Record<string, unknown>): string | undefined {
  if (item.common && typeof item.common === 'object') {
    const common = item.common as Record<string, unknown>;
    if (
      common.thumbnailUrl &&
      (typeof common.thumbnailUrl === 'string' ||
        Array.isArray(common.thumbnailUrl))
    ) {
      return normalizeThumbnailUrl(common.thumbnailUrl as string | string[]);
    }
  }

  const imageFields = [
    'cobas-18-u', // サムネイル画像
    'keioobjecthub-5-u', // 画像URL
    'adeac-6-u', // 画像URL
    'thumbnailUrl', // 汎用
    'imageUrl', // 汎用
  ];
  const imageUrls = extractFromDynamicFields(item, imageFields);

  return imageUrls.find(
    (url) =>
      url.startsWith('http') &&
      (url.includes('.jpg') ||
        url.includes('.jpeg') ||
        url.includes('.png') ||
        url.includes('.gif'))
  );
}

/**
 * 動的フィールドから説明文を抽出
 */
function extractDescription(item: Record<string, unknown>): string | undefined {
  if (item.common && typeof item.common === 'object') {
    const common = item.common as Record<string, unknown>;
    if (common.description && typeof common.description === 'string') {
      return common.description.replace(/<[^>]*>/g, '').trim();
    }
  }

  const descFields = [
    'cobas-17-h', // 説明文（HTML）
    'keioobjecthub-2-s', // 説明文
    'adeac-4-s', // 説明文
    'description', // 汎用
    'abstract', // 汎用
    'summary', // 汎用
  ];

  const descriptions = extractFromDynamicFields(item, descFields);

  if (descriptions.length > 0) {
    const bestDesc = descriptions.reduce((prev, current) =>
      current.length > prev.length ? current : prev
    );

    return bestDesc.replace(/<[^>]*>/g, '').trim();
  }

  return undefined;
}

/**
 * 動的フィールドからデータプロバイダーを抽出
 */
function extractDataProvider(
  item: Record<string, unknown>
): string | undefined {
  if (item.common && typeof item.common === 'object') {
    const common = item.common as Record<string, unknown>;
    if (common.dataProvider && typeof common.dataProvider === 'string') {
      return common.dataProvider;
    }
    if (common.provider && typeof common.provider === 'string') {
      return common.provider;
    }
  }

  const providerFields = [
    'cobas-16-s', // cobas: 提供機関
    'keioobjecthub-30-s', // keio: 提供機関
    'adeac-16-s', // adeac: 提供機関
    'provider', // 汎用
    'institution', // 汎用
    'dataProvider', // 汎用
  ];
  const providers = extractFromDynamicFields(item, providerFields);
  return providers[0];
}

/**
 * 動的フィールドから日付を抽出
 */
function extractDate(item: Record<string, unknown>): string | undefined {
  if (item.common && typeof item.common === 'object') {
    const common = item.common as Record<string, unknown>;
    if (common.date && typeof common.date === 'string') {
      return common.date;
    }
    if (common.temporal) {
      if (typeof common.temporal === 'string') {
        return common.temporal;
      }
      if (Array.isArray(common.temporal) && common.temporal.length > 0) {
        return common.temporal[0];
      }
    }
  }

  const dateFields = [
    'cobas-11-s', // cobas: 時代・年代
    'keioobjecthub-4-d', // keio: 日付
    'adeac-8-s', // adeac: 日付
    'date', // 汎用
    'created', // 汎用
    'temporal', // 汎用
  ];

  const dates = extractFromDynamicFields(item, dateFields);
  return dates[0];
}

/**
 * アイテムを正規化
 */
export function normalizeJapanSearchItem(
  item: JapanSearchItem & Record<string, unknown>
): JapanSearchItem {
  const title = extractTitle(item);
  const thumbnailUrl = extractImageUrl(item);
  const description = extractDescription(item);
  const dataProvider = extractDataProvider(item);
  const date = extractDate(item);
  const creator =
    item.common?.creator ||
    extractFromDynamicFields(item, [
      'cobas-8-s', // 作者
      'keioobjecthub-3-s', // 作者
      'adeac-2-s', // 作者
      'creator', // 汎用
      'author', // 汎用
    ]);

  const subject =
    item.common?.subject ||
    extractFromDynamicFields(item, [
      'cobas-4-s', // 分類
      'keioobjecthub-12-s', // 主題
      'adeac-7-s', // 主題
      'subject', // 汎用
      'theme', // 汎用
    ]);

  // 地理的情報の抽出
  const spatial =
    item.common?.spatial ||
    extractFromDynamicFields(item, [
      'cobas-29-s', // 地域
      'keioobjecthub-28-s', // 地域
      'adeac-12-s', // 地域
      'spatial', // 汎用
      'location', // 汎用
    ]);

  // 言語情報の抽出
  const language =
    item.common?.language ||
    extractFromDynamicFields(item, [
      'cobas-46-s', // 言語
      'keioobjecthub-13-s', // 言語
      'adeac-9-s', // 言語
      'language', // 汎用
      'lang', // 汎用
    ])[0];

  // 権利情報の抽出
  const rights =
    item.common?.rights ||
    extractFromDynamicFields(item, [
      'cobas-15-s', // 権利者
      'keioobjecthub-19-s', // 権利
      'adeac-15-s', // 権利
      'rights', // 汎用
      'copyright', // 汎用
    ])[0];

  // 識別子の抽出
  const identifier =
    item.id ||
    item.common?.identifier ||
    extractFromDynamicFields(item, [
      'cobas-2-s', // 識別子
      'keioobjecthub-0-s', // 識別子
      'adeac-0-s', // 識別子
      'identifier', // 汎用
      'id', // 汎用
    ])[0];

  return {
    ...item,
    common: {
      ...item.common,
      title: title || item.common?.title || '無題',
      description: description || item.common?.description,
      thumbnailUrl: thumbnailUrl || item.common?.thumbnailUrl,
      dataProvider: dataProvider || item.common?.dataProvider,
      date: date || item.common?.date,
      landingPage: item.common?.linkUrl || item.common?.landingPage,
      creator: creator && creator.length > 0 ? creator : item.common?.creator,
      subject: subject && subject.length > 0 ? subject : item.common?.subject,
      spatial: spatial && spatial.length > 0 ? spatial : item.common?.spatial,
      language: language || item.common?.language,
      rights: rights || item.common?.rights,
      identifier: identifier || item.common?.identifier,
    },
  };
}
