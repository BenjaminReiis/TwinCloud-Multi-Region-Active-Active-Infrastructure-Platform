import { useState } from 'react';
import { Globe2, Activity, Zap, Server, TrendingUp } from 'lucide-react';
import { useRegions, useSimulatedMetrics } from '@/hooks/useData';
import { StatusBadge, LoadingState, ProgressBar, Sparkline } from '@/components/ui';
import { statusConfig } from '@/lib/theme';
import type { Region } from '@/lib/supabase';

const statusOrder: Record<string, number> = { active: 0, degraded: 1, maintenance: 2, offline: 3 };

export function RegionsView() {
  const { regions, loading, error } = useRegions();
  const [selected, setSelected] = useState<Region | null>(null);
  useSimulatedMetrics(true);

  if (loading) return <LoadingState message="Loading regions..." />;

  const sorted = [...regions].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
  const avgLatency = regions.length > 0 ? Math.round(regions.reduce((s, r) => s + r.latency_ms, 0) / regions.length) : 0;
  const avgLoad = regions.length > 0 ? Math.round(regions.reduce((s, r) => s + r.load_pct, 0) / regions.length) : 0;
  const totalInstances = regions.reduce((s, r) => s + r.instances, 0);
  const activeCount = regions.filter((r) => r.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Globe2 className="h-4 w-4" /> Total Regions</div>
          <p className="mt-1 text-2xl font-semibold text-white">{regions.length}</p>
          <p className="text-xs text-emerald-400">{activeCount} active</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Zap className="h-4 w-4" /> Avg Latency</div>
          <p className="mt-1 text-2xl font-semibold text-white">{avgLatency}ms</p>
          <p className="text-xs text-slate-400">cross-region</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Activity className="h-4 w-4" /> Avg Load</div>
          <p className="mt-1 text-2xl font-semibold text-white">{avgLoad}%</p>
          <ProgressBar value={avgLoad} colorClass={avgLoad > 70 ? 'bg-amber-500' : 'bg-emerald-500'} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Server className="h-4 w-4" /> Instances</div>
          <p className="mt-1 text-2xl font-semibold text-white">{totalInstances}</p>
          <p className="text-xs text-slate-400">across all regions</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Global Infrastructure Map</h3>
        <WorldMap regions={sorted} onSelect={setSelected} selected={selected} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((region) => (
          <RegionCard key={region.id} region={region} onClick={() => setSelected(region)} isSelected={selected?.id === region.id} />
        ))}
      </div>

      {selected && <RegionDetail region={selected} />}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}

function WorldMap({ regions, onSelect, selected }: { regions: Region[]; onSelect: (r: Region) => void; selected: Region | null }) {
  const project = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-slate-950">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="200" height="100" fill="url(#grid)" />
        <g fill="#1e293b" opacity="0.6">
          <path d="M 20,20 L 55,18 L 60,30 L 50,45 L 35,48 L 25,40 Z" />
          <path d="M 55,55 L 68,50 L 72,70 L 62,85 L 55,75 Z" />
          <path d="M 95,20 L 115,18 L 118,35 L 100,38 L 92,30 Z" />
          <path d="M 100,40 L 118,38 L 122,55 L 115,78 L 105,75 L 98,55 Z" />
          <path d="M 115,18 L 175,15 L 180,40 L 160,45 L 140,42 L 118,35 Z" />
          <path d="M 165,70 L 185,68 L 188,80 L 170,82 Z" />
        </g>
      </svg>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        {regions.filter((r) => r.status === 'active').map((r, i, arr) => {
          if (i === arr.length - 1) return null;
          const next = arr[(i + 1) % arr.length];
          const p1 = project(r.coordinates.lat, r.coordinates.lng);
          const p2 = project(next.coordinates.lat, next.coordinates.lng);
          return (
            <line key={`${r.code}-${next.code}`} x1={p1.x} y1={p1.y * 0.5} x2={p2.x} y2={p2.y * 0.5}
              stroke="#3380ff" strokeWidth="0.15" strokeDasharray="0.5 0.5" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </line>
          );
        })}
      </svg>

      {regions.map((region) => {
        const { x, y } = project(region.coordinates.lat, region.coordinates.lng);
        const config = statusConfig[region.status as keyof typeof statusConfig];
        const isSelected = selected?.id === region.id;
        return (
          <button key={region.id} onClick={() => onSelect(region)}
            className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className={`absolute inset-0 -m-2 animate-ping rounded-full ${config?.dot} opacity-20`} style={{ animationDuration: '2s' }} />
            <span className={`relative block h-3 w-3 rounded-full ${config?.dot} ring-2 ring-slate-950 transition-all group-hover:scale-150 ${isSelected ? 'scale-150 ring-2 ring-blue-400' : ''}`} />
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
              {region.code}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RegionCard({ region, onClick, isSelected }: { region: Region; onClick: () => void; isSelected: boolean }) {
  const config = statusConfig[region.status as keyof typeof statusConfig];
  const loadColor = region.load_pct > 75 ? 'bg-rose-500' : region.load_pct > 50 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <button onClick={onClick}
      className={`group rounded-xl border bg-slate-900/60 p-5 text-left transition-all hover:border-slate-700 hover:bg-slate-900 ${
        isSelected ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-slate-800'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800/60">
            <Globe2 className={`h-5 w-5 ${config?.color || 'text-slate-400'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{region.name}</p>
            <code className="text-xs text-slate-500">{region.code}</code>
          </div>
        </div>
        <StatusBadge status={region.status} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-slate-950/40 p-2">
          <p className="text-[10px] uppercase text-slate-500">Latency</p>
          <p className="text-sm font-semibold text-white">{region.latency_ms}<span className="text-xs text-slate-500">ms</span></p>
        </div>
        <div className="rounded-lg bg-slate-950/40 p-2">
          <p className="text-[10px] uppercase text-slate-500">Uptime</p>
          <p className="text-sm font-semibold text-white">{Number(region.uptime_pct).toFixed(2)}<span className="text-xs text-slate-500">%</span></p>
        </div>
        <div className="rounded-lg bg-slate-950/40 p-2">
          <p className="text-[10px] uppercase text-slate-500">Instances</p>
          <p className="text-sm font-semibold text-white">{region.instances}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Load</span>
          <span className="text-slate-300">{region.load_pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full rounded-full transition-all ${loadColor}`} style={{ width: `${region.load_pct}%` }} />
        </div>
      </div>
    </button>
  );
}

function RegionDetail({ region }: { region: Region }) {
  const loadData = Array.from({ length: 12 }, (_, i) => {
    const base = region.load_pct;
    const variance = Math.sin(i * 0.5) * 15;
    return Math.max(0, Math.min(100, base + variance + (Math.random() - 0.5) * 10));
  });
  const latencyData = Array.from({ length: 12 }, (_, i) => {
    const base = region.latency_ms;
    return base + Math.sin(i * 0.3) * 5 + (Math.random() - 0.5) * 8;
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{region.name} — Region Details</h3>
          <p className="text-xs text-slate-500">{region.continent} · {region.code}</p>
        </div>
        <StatusBadge status={region.status} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Load Trend (simulated)</p>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3"><Sparkline data={loadData} color="#3380ff" width={300} height={60} /></div>
        </div>
        <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Latency Trend (simulated)</p>
            <Zap className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3"><Sparkline data={latencyData} color="#10b981" width={300} height={60} /></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <DetailStat label="Status" value={region.status} />
        <DetailStat label="Continent" value={region.continent} />
        <DetailStat label="Instances" value={region.instances.toString()} />
        <DetailStat label="Uptime" value={`${Number(region.uptime_pct).toFixed(2)}%`} />
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-white">{value}</p>
    </div>
  );
}
