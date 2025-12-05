/**
 * 建立日を適切にフォーマットする関数
 *
 * @param dateString - 「昭和12年4月」などの和暦文字列
 * @returns フォーマットされた日付文字列
 */
export function formatEstablishedDate(dateString: string): string {
  return dateString;
}

/**
 * URLパラメータを生成する関数
 *
 * @param baseUrl - ベースURL
 * @param params - パラメータオブジェクト
 * @returns パラメータ付きURL
 */
export function createUrlWithParams(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}
