'use client';

type DashboardChartProps = {
  title: string;
  data: Array<{ label: string; value: string }>;
};

export default function DashboardChart({ title, data }: DashboardChartProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/85 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">Overview of recent trends</p>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-violet-500" style={{ width: item.value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
