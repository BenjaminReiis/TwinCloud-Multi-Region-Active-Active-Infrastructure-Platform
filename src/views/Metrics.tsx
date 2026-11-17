import { useState, useMemo } from 'react';
import { Activity, Zap, AlertCircle, Cpu, MemoryStick, Globe2 } from 'lucide-react';
import { useMetrics, useRegions } from '@/hooks/useData';
import { LoadingState } from '@/components/ui';
import type { MetricType } from '@/lib/supabase';

const metricConfig: Record<string, { label: string; icon: typeof Activity; color: string; unit: string }> = {
  requests_per_sec: { label: 'Requests / sec', icon: Activity, color: '#3380ff', unit: 'rps' },
  latency: { label: 'Latency', icon: Zap, color: '#10b981', unit: 'ms' },
  error_rate: { label: 'Error Rate', icon: AlertCircle, color: '#f59e0b', unit: '%' },
  cpu: { label: 'CPU Usage', icon: Cpu, color: '#8b5cf6', unit: '%' },
  memory: { label: 'Memory Usage', icon: MemoryStick, color: '#ec4899', unit: '%' },
};

export function MetricsView() {
  const { metrics, loading, error } = useMetrics();
  const { regions } = useRegions();
  const [activeMetric, setActiveMetric] = useState<MetricType>('requests_per_sec');
  const [activeRegion, setActiveRegion] = useState<string>('all');

  const chartData = useMemo(() => {
    const filtered = metrics.filter(
      (m) => m.metric_type === activeMetric && (activeRegion === 'all' || m.region_code === activeRegion)
    );
    const byRegion = new Map<string, { time: string; values: number[] }>();
    for (const m of filtered) {
      const key = m.region_code;
      if (!byRegion.has(key)) byRegion.set(key, { time: m.recorded_at, values: [] });
      byRegion.get(key)!.values.push(Number(m.value));
    }
    const times = [...new Set(filtered.map((m) => m.recorded_at))].sort();
    return { times, byRegion, filtered };
  }, [metrics, activeMetric, activeRegion]);

  if (loading) return <LoadingState message="Loading metrics..." />;

  const config = metricConfig[activeMetric];
  const latestValues = chartData.filtered.filter((m) => {
    const maxTime = Math.max(...chartData.filtered.map((x) => new Date(x.recorded_at).getTime()));
    return new Date(m.recorded_at).getTime() === maxTime;
  });
  const avgValue = latestValues.length > 0
    ? latestValues.reduce((s, m) => s + Number(m.value), 0) / latestValues.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(metricConfig) as MetricType[]).map((key) => {
          const cfg = metricConfig[key];
          const isActive = activeMetric === key;
          return (
            <button key={key} onClick={() => setActiveMetric(key)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                isActive ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}>
              <cfg.icon className="h-4 w-4" />{cfg.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <config.icon className="h-4 w-4" style={{ color: config.color }} /> Current {config.label}
          </div>
          <p className="mt-1 text-2xl font-semibold text-white">{avgValue.toFixed(1)} <span className="text-sm text-slate-500">{config.unit}</span></p>
          <p className="text-xs text-slate-400">avg across regions</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Globe2 className="h-4 w-4" /> Regions Tracked</div>
          <p className="mt-1 text-2xl font-semibold text-white">{regions.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Activity className="h-4 w-4" /> Data Points</div>
          <p className="mt-1 text-2xl font-semibold text-white">{chartData.filtered.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Zap className="h-4 w-4" /> Time Range</div>
          <p className="mt-1 text-2xl font-semibold text-white">24h</p>
          <p className="text-xs text-slate-400">hourly snapshots</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveRegion('all')}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            activeRegion === 'all' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
          }`}>All Regions</button>
        {regions.map((r) => (
          <button key={r.code} onClick={() => setActiveRegion(r.code)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              activeRegion === r.code ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
            }`}>{r.code}</button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{config.label} Over Time</h3>
            <p className="text-xs text-slate-500">Last 12 hours · hourly resolution</p>
          </div>
        </div>
        <MetricChart data={chartData.filtered} color={config.color} unit={config.unit} />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Per-Region Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => {
            const regionMetrics = chartData.filtered.filter((m) => m.region_code === region.code);
            const avg = regionMetrics.length > 0 ? regionMetrics.reduce((s, m) => s + Number(m.value), 0) / regionMetrics.length : 0;
            const max = regionMetrics.length > 0 ? Math.max(...regionMetrics.map((m) => Number(m.value))) : 0;
            return (
              <div key={region.code} className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{region.name}</span>
                  <code className="text-[10px] text-slate-500">{region.code}</code>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Average</span>
                    <span className="font-medium text-white">{avg.toFixed(1)} {config.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Peak</span>
                    <span className="font-medium text-white">{max.toFixed(1)} {config.unit}</span>
                  </div>
                </div>
                <div className="mt-2"><MiniBar data={regionMetrics.map((m) => Number(m.value))} color={config.color} /></div>
              </div>
            );
          })}
        </div>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

function MetricChart({ data, color, unit }: { data: { region_code: string; value: number; recorded_at: string }[]; color: string; unit: string }) {
  if (data.length === 0) return <div className="flex h-64 items-center justify-center text-sm text-slate-500">No data available</div>;

  const byRegion = new Map<string, { recorded_at: string; value: number }[]>();
  for (const d of data) {
    if (!byRegion.has(d.region_code)) byRegion.set(d.region_code, []);
    byRegion.get(d.region_code)!.push({ recorded_at: d.recorded_at, value: Number(d.value) });
  }
  for (const [, arr] of byRegion) arr.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

  const allTimes = [...new Set(data.map((d) => d.recorded_at))].sort();
  const allValues = data.map((d) => Number(d.value));
  const maxVal = Math.max(...allValues) * 1.1 || 1;
  const minVal = Math.min(...allValues, 0);

  const width = 800, height = 280;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const colors = ['#3380ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];
  let colorIdx = 0;

  return (
    <div className="overflow-x-auto">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="min-w-[600px]">
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartH * pct;
          const val = maxVal - (maxVal - minVal) * pct;
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeWidth="0.5" />
              <text x={padding.left - 8} y={y + 3} textAnchor="end" className="fill-slate-500 text-[9px]">{val.toFixed(0)}</text>
            </g>
          );
        })}
        {allTimes.map((time, i) => {
          if (i % 2 !== 0 && i !== allTimes.length - 1) return null;
          const x = padding.left + (i / Math.max(1, allTimes.length - 1)) * chartW;
          const label = new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          return <text key={time} x={x} y={height - 10} textAnchor="middle" className="fill-slate-500 text-[9px]">{label}</text>;
        })}
        {[...byRegion.entries()].map(([code, points]) => {
          const lineColor = colors[colorIdx++ % colors.length];
          const stepX = chartW / Math.max(1, points.length - 1);
          const pathD = points.map((p, i) => {
            const x = padding.left + i * stepX;
            const y = padding.top + chartH * (1 - (Number(p.value) - minVal) / (maxVal - minVal || 1));
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');
          return (
            <g key={code}>
              <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {points.map((p, i) => {
                const x = padding.left + i * stepX;
                const y = padding.top + chartH * (1 - (Number(p.value) - minVal) / (maxVal - minVal || 1));
                return <circle key={i} cx={x} cy={y} r="2.5" fill={lineColor} className="opacity-0 hover:opacity-100" />;
              })}
            </g>
          );
        })}
        {[...byRegion.keys()].map((code, i) => {
          const lc = colors[i % colors.length];
          return (
            <g key={code} transform={`translate(${padding.left + i * 90}, ${height - 0})`}>
              <line x1="0" y1="-22" x2="14" y2="-22" stroke={lc} strokeWidth="2" />
              <text x="18" y="-18" className="fill-slate-400 text-[9px]">{code}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MiniBar({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data) || 1;
  return (
    <div className="flex h-8 items-end gap-0.5">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.4 + (v / max) * 0.6 }} />
      ))}
    </div>
  );
}
