import { HaikuMonument } from '@/types/definitions/haiku';
import { HaikuCard } from '@/components/shared/HaikuCard';

type PoetMonumentsProps = {
  monuments: HaikuMonument[];
  poetName: string;
};

export function PoetMonuments({ monuments, poetName }: PoetMonumentsProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">{poetName}の句碑</h2>

      {monuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {monuments.map((monument) => (
            <HaikuCard key={monument.id} monument={monument} />
          ))}
        </div>
      ) : (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            この俳人に関連する句碑は見つかりませんでした。
          </p>
        </div>
      )}
    </>
  );
}
