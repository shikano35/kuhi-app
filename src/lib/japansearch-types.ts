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

  const titlePatterns = ['-1-s', '-10-s', '-11-s', 'title'];
  const titles = extractFromDynamicFields(item, titlePatterns);

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

  const imagePatterns = ['-6-u', '-16-u', 'image', 'thumbnail'];
  const imageUrls = extractFromDynamicFields(item, imagePatterns);

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
      return common.description;
    }
  }

  const descPatterns = ['-5-s', '-9-s', '-7-s', 'description', 'abstract'];
  const descriptions = extractFromDynamicFields(item, descPatterns);

  if (descriptions.length > 0) {
    return descriptions.reduce((prev, current) =>
      current.length > prev.length ? current : prev
    );
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

  const providerPatterns = ['-42-s', '-16-s', 'provider', 'institution'];
  const providers = extractFromDynamicFields(item, providerPatterns);

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
  }

  const datePatterns = ['-8-s', '-3-s', 'date', 'created'];
  const dates = extractFromDynamicFields(item, datePatterns);

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
    item.common.creator ||
    extractFromDynamicFields(item, ['-2-s', 'creator', 'author']);
  const subject =
    item.common.subject ||
    extractFromDynamicFields(item, ['-7-s', 'subject', 'theme']);
  const spatial =
    item.common.spatial ||
    extractFromDynamicFields(item, ['-12-s', 'spatial', 'location']);
  const language = extractFromDynamicFields(item, [
    '-9-s',
    'language',
    'lang',
  ])[0];
  const rights = extractFromDynamicFields(item, [
    '-15-s',
    'rights',
    'copyright',
  ])[0];
  const identifier =
    item.id || extractFromDynamicFields(item, ['identifier', 'id'])[0];

  return {
    ...item,
    common: {
      ...item.common,
      title: title || item.common.title || '無題',
      description: description || item.common.description,
      thumbnailUrl: thumbnailUrl,
      dataProvider: dataProvider || item.common.dataProvider,
      date: date || item.common.date,
      landingPage: item.common.linkUrl || item.common.landingPage,
      creator: creator && creator.length > 0 ? creator : item.common.creator,
      subject: subject && subject.length > 0 ? subject : item.common.subject,
      spatial: spatial && spatial.length > 0 ? spatial : item.common.spatial,
      language: language || item.common.language,
      rights: rights || item.common.rights,
      identifier: identifier || item.common.identifier,
    },
  };
}
