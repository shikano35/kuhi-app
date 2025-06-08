'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { type HistoryDataPoint } from './utils';

type ChartMode = 'monuments' | 'poets';

export type ClientHistoryChartProps = {
  historyData: HistoryDataPoint[];
};

export function ClientHistoryChart({ historyData }: ClientHistoryChartProps) {
  const [mode, setMode] = useState<ChartMode>('monuments');

  const ticks = historyData
    .map((d) => d.year)
    .filter((year) => (year - 1600) % 50 === 0);

  const renderTooltipContent = (props: TooltipProps<number, string>) => {
    const { payload, label } = props;
    if (!payload || !payload.length) return null;

    const data = payload[0].payload as HistoryDataPoint;

    return (
      <div className="bg-background p-4 shadow-md rounded-md border border-border">
        <p className="font-semibold">{`${label}年頃`}</p>
        <p className="text-muted-foreground">{data.events}</p>
        <p className="text-primary mt-2">
          {mode === 'monuments'
            ? `句碑数: ${data.monuments}基`
            : `俳人数: ${data.poets}人`}
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            className={`px-4 py-2 text-sm font-medium border ${
              mode === 'monuments'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-l-md`}
            onClick={() => setMode('monuments')}
            type="button"
          >
            句碑数
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border ${
              mode === 'poets'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-r-md`}
            onClick={() => setMode('poets')}
            type="button"
          >
            俳人数
          </button>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={historyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid opacity={0.2} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: '西暦（年）',
                position: 'insideBottom',
                offset: -10,
              }}
              ticks={ticks}
            />
            <YAxis
              label={{
                value: mode === 'monuments' ? '句碑数（基）' : '俳人数（人）',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={renderTooltipContent} />
            <Area
              dataKey={mode}
              fill="url(#colorValue)"
              fillOpacity={1}
              stroke="#4f46e5"
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
