import { statusConfig, severityConfig } from '@/lib/theme';
import type { LucideIcon } from 'lucide-react';

export function StatusBadge({ status }: { status: string }) {
  const config = (statusConfig as Record<string, { label: string; color: string; bg: string; border: string; dot: string }>)[status];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.border} ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const config = (severityConfig as Record<string, { label: string; color: string; bg: string; border: string }>)[severity];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${config.bg} ${config.border} ${config.color}`}>
      {config.label}
    </span>
  );
}

export function StatCard({ icon: Icon, label, value, sub, accent = 'text-blue-400' }: {
  icon: LucideIcon; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`rounded-lg bg-slate-800/50 p-2.5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export function ProgressBar({ value, colorClass = 'bg-blue-500' }: { value: number; colorClass?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Sparkline({ data, color = '#3380ff', height = 40, width = 120 }: {
  data: number[]; color?: string; height?: number; width?: number;
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gid = `spark-${color.replace('#', '')}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-rose-400">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
