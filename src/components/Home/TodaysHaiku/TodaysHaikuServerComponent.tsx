import { getMonuments } from '@/lib/kuhi-api';
import { TodaysHaikuClientComponent } from './TodaysHaikuClientComponent';

/**
 * 日付ベースでシード値を生成し、毎日変わるランダムな句碑を選択
 */
function getDailyRandomIndex(arrayLength: number): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // シンプルなハッシュ関数
  const hash = ((seed * 9301 + 49297) % 233280) / 233280;
  return Math.floor(hash * arrayLength);
}

export async function TodaysHaikuServerComponent() {
  try {
    // 句碑データを取得
    const monuments = await getMonuments({ limit: 100 });

    if (monuments.length === 0) {
      return null;
    }

    // 碑文（俳句）があるものだけをフィルタリング
    const monumentsWithPoems = monuments.filter(
      (m) =>
        m.inscriptions &&
        m.inscriptions.length > 0 &&
        m.inscriptions[0].poems &&
        m.inscriptions[0].poems.length > 0
    );

    if (monumentsWithPoems.length === 0) {
      return null;
    }

    // 日付ベースでランダムに選択
    const randomIndex = getDailyRandomIndex(monumentsWithPoems.length);
    const selectedMonument = monumentsWithPoems[randomIndex];

    return <TodaysHaikuClientComponent monument={selectedMonument} />;
  } catch {
    return null;
  }
}
