import { getMonuments, getPoets } from '@/lib/kuhi-api';
import { PickupClientComponent } from './PickupClientComponent';

/**
 * 日付ベースでシャッフルされたインデックスを生成
 */
function getDailyShuffledIndices(arrayLength: number, count: number): number[] {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const indices: number[] = [];
  const available = Array.from({ length: arrayLength }, (_, i) => i);

  for (let i = 0; i < Math.min(count, arrayLength); i++) {
    const hash = (((seed + i) * 9301 + 49297 + i * 1000) % 233280) / 233280;
    const randomIndex = Math.floor(hash * available.length);
    indices.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return indices;
}

export async function PickupServerComponent() {
  try {
    // 句碑と俳人のデータを並行で取得
    const [monuments, poets] = await Promise.all([
      getMonuments({ limit: 50 }),
      getPoets({ limit: 50 }),
    ]);

    // 碑文がある句碑のみをフィルタリング
    const validMonuments = monuments.filter(
      (m) =>
        m.inscriptions &&
        m.inscriptions.length > 0 &&
        m.inscriptions[0].poems &&
        m.inscriptions[0].poems.length > 0
    );

    // 画像がある俳人を優先
    const poetsWithImage = poets.filter((p) => p.image_url);
    const poetsWithoutImage = poets.filter((p) => !p.image_url);
    const sortedPoets = [...poetsWithImage, ...poetsWithoutImage];

    // 日付ベースでランダムに選択
    const monumentIndices = getDailyShuffledIndices(validMonuments.length, 4);
    const poetIndices = getDailyShuffledIndices(sortedPoets.length, 4);

    const pickupMonuments = monumentIndices.map((i) => validMonuments[i]);
    const pickupPoets = poetIndices.map((i) => sortedPoets[i]);

    return (
      <PickupClientComponent monuments={pickupMonuments} poets={pickupPoets} />
    );
  } catch {
    return null;
  }
}
