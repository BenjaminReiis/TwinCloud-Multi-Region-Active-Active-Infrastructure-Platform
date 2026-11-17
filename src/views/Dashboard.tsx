import { Globe2, Server, Rocket, AlertTriangle, Cpu, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { useRegions, useServices, useIncidents, useDeployments } from '@/hooks/useData';
import { StatCard, StatusBadge, LoadingState, Sparkline } from '@/components/ui';
import { formatRelativeTime, formatDuration } from '@/lib/theme';
import type { ViewKey } from '@/components/Sidebar';

export function DashboardView({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { regions, loading: rl } = useRegions();
  const { services, loading: sl } = useServices();
  const { incidents, loading: il } = useIncidents();
  const { deployments, loading: dl } = useDeployments(6);

  if (rl || sl || il || dl) return <LoadingState message="Loading platform overview..." />;

  const activeRegions = regions.filter((r) => r.status === 'active').length;
  const runningServices = services.filter((s) => s.status === 'running').length;
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved').length;
  const avgLatency = regions.length > 0
    ? Math.round(regions.reduce((sum, r) => sum + r.latency_ms, 0) / regions.length) : 0;
  const avgUptime = regions.length > 0
    ? (regions.reduce((sum, r) => sum + Number(r.uptime_pct), 0) / regions.length).toFixed(2) : '0';
  const totalInstances = regions.reduce((sum, r) => sum + r.instances, 0);
  const totalReplicas = services.reduce((sum, s) => sum + s.replicas, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Globe2} label="Active Regions" value={`${activeRegions}/${regions.length}`} sub={`${totalInstances} instances total`} accent="text-blue-400" />
        <StatCard icon={Server} label="Running Services" value={`${runningServices}/${services.length}`} sub={`${totalReplicas} replicas`} accent="text-emerald-400" />
        <StatCard icon={Zap} label="Avg Latency" value={`${avgLatency}ms`} sub={`${avgUptime}% avg uptime`} accent="text-cyan-400" />
        <StatCard icon={AlertTriangle} label="Active Incidents" value={activeIncidents} sub={`${incidents.length} total tracked`} accent="text-amber-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Region Health</h3>
              <p className="text-xs text-slate-500">Multi-region active-active status</p>
            </div>
            <button onClick={() => onNavigate('regions')} className="text-xs font-medium text-blue-400 hover:text-blue-300">View all →</button>
          </div>
          <div className="space-y-3">
            {regions.map((region) => (
              <div key={region.id} className="group flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3 transition-all hover:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/60">
                    <Globe2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{region.name}</p>
                      <code className="text-[10px] text-slate-500">{region.code}</code>
                    </div>
                    <p className="text-xs text-slate-500">{region.continent} · {region.instances} instances</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-slate-400">{region.latency_ms}ms</p>
                    <p className="text-[10px] text-slate-600">{Number(region.uptime_pct).toFixed(2)}% uptime</p>
                  </div>
                  <div className="hidden md:block">
                    <Sparkline data={[region.load_pct, 100 - region.load_pct, region.load_pct, region.load_pct + 10, region.load_pct - 5, region.load_pct]} color="#3380ff" width={80} height={30} />
                  </div>
                  <StatusBadge status={region.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Deployments</h3>
              <p className="text-xs text-slate-500">Latest rollout activity</p>
            </div>
            <button onClick={() => onNavigate('deployments')} className="text-xs font-medium text-blue-400 hover:text-blue-300">View →</button>
          </div>
          <div className="space-y-3">
            {deployments.map((dep) => {
              const svc = services.find((s) => s.id === dep.service_id);
              return (
                <div key={dep.id} className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-white">{svc?.name || 'Unknown'}</span>
                    </div>
                    <StatusBadge status={dep.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{dep.version}</span>
                    <span>{formatRelativeTime(dep.created_at)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                    <span>{dep.region_code}</span><span>·</span><span>{dep.trigger}</span>
                    {dep.duration_ms > 0 && (<><span>·</span><span>{formatDuration(dep.duration_ms)}</span></>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Service Resource Usage</h3>
            <p className="text-xs text-slate-500">CPU and memory utilization across services</p>
          </div>
          <button onClick={() => onNavigate('services')} className="text-xs font-medium text-blue-400 hover:text-blue-300">Manage services →</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((svc) => (
            <div key={svc.id} className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium text-white">{svc.name}</span>
                <StatusBadge status={svc.status} />
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-400"><Cpu className="h-3 w-3" /> CPU</span>
                    <span className="text-slate-300">{svc.cpu_pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full transition-all ${svc.cpu_pct > 80 ? 'bg-rose-500' : svc.cpu_pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${svc.cpu_pct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-400"><Server className="h-3 w-3" /> Memory</span>
                    <span className="text-slate-300">{svc.memory_pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full transition-all ${svc.memory_pct > 80 ? 'bg-rose-500' : svc.memory_pct > 60 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${svc.memory_pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Incident Summary</h3>
            <p className="text-xs text-slate-500">Active and recently resolved incidents</p>
          </div>
          <button onClick={() => onNavigate('incidents')} className="text-xs font-medium text-blue-400 hover:text-blue-300">View all →</button>
        </div>
        <div className="space-y-2">
          {incidents.slice(0, 4).map((inc) => (
            <div key={inc.id} className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
              <div className="flex items-center gap-3">
                {inc.status === 'resolved' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-amber-400" />}
                <div>
                  <p className="text-sm font-medium text-white">{inc.title}</p>
                  <p className="text-xs text-slate-500">{inc.region_code} · {formatRelativeTime(inc.created_at)}</p>
                </div>
              </div>
              <StatusBadge status={inc.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Throughput" value="8.2k rps" sub="across all regions" accent="text-cyan-400" />
        <StatCard icon={CheckCircle2} label="Success Rate" value="99.94%" sub="last 24 hours" accent="text-emerald-400" />
        <StatCard icon={Rocket} label="Deployments (24h)" value={deployments.length.toString()} sub="across all regions" accent="text-blue-400" />
        <StatCard icon={Globe2} label="Global Coverage" value="6 continents" sub={`${regions.length} regions`} accent="text-violet-400" />
      </div>
    </div>
  );
}
