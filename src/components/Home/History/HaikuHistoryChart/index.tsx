import { ClientHistoryChart } from './index.stories';
import { getAllHaikuMonuments } from '@/lib/api';
import { processHistoryData } from './utils';

export async function HaikuHistoryChart() {
  const monuments = await getAllHaikuMonuments();

  const historyData = processHistoryData(monuments);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ClientHistoryChart historyData={historyData} />
    </div>
  );
}
