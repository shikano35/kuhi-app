/**
 * 建立日を適切にフォーマットする関数
 *
 * @param dateString - 「昭和12年4月」などの和暦文字列
 * @returns フォーマットされた日付文字列
 */
export function formatEstablishedDate(dateString: string): string {
  // そのまま返す（将来的に和暦→西暦変換なども実装可能）
  return dateString;
}

/**
 * 句碑カードの表示用に俳句を短くする関数
 *
 * @param inscription - 俳句の全文
 * @param maxLength - 最大長さ（デフォルト30文字）
 * @returns 短縮された俳句文字列
 */
export function truncateInscription(
  inscription: string,
  maxLength = 30
): string {
  if (!inscription || inscription.length <= maxLength) {
    return inscription || '';
  }
  return `${inscription.slice(0, maxLength)}...`;
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
