'use client';

type LegendItem = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  value: number; // 0 to 100 for the main circle
  size?: number;
  strokeWidth?: number;
  data: LegendItem[];
};

export default function DonutChart({ value, size = 130, strokeWidth = 12, data }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-none stroke-slate-100 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
          />
          {/* Multi-segments circles */}
          {data.map((item, idx) => {
            const segmentLength = (item.value / 100) * circumference;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.value;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="fill-none transition-all duration-700 ease-out"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-800 dark:text-white">{value}%</span>
        </div>
      </div>
      
      {/* Legend dots */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-medium">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
