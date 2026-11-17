import { useEffect, useState } from 'react';

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Live</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-200 tabular-nums">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </p>
          <p className="text-[10px] text-slate-500">UTC</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
          TC
        </div>
      </div>
    </header>
  );
}
