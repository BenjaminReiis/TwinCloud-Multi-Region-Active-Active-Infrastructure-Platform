import { useState } from 'react';
import { Server, Cpu, MemoryStick, Boxes, Search, Rocket } from 'lucide-react';
import { useServices, useDeployments } from '@/hooks/useData';
import { StatusBadge, LoadingState, EmptyState, ProgressBar } from '@/components/ui';
import { Bolt Database } from '@/lib/supabase';
import type { Service } from '@/lib/supabase';

const typeIcons: Record<string, typeof Server> = {
  web: Server, api: Server, worker: Boxes, database: Server, cache: MemoryStick, queue: Server,
};

export function ServicesView() {
  const { services, loading, error, refresh } = useServices();
  const { refresh: refreshDeployments } = useDeployments();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [deploying, setDeploying] = useState<string | null>(null);

  if (loading) return <LoadingState message="Loading services..." />;

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDeploy = async (service: Service) => {
    setDeploying(service.id);
    await supabase.from('services').update({ status: 'deploying', updated_at: new Date().toISOString() }).eq('id', service.id);
    await refresh();
    await refreshDeployments();
    setTimeout(async () => {
      await supabase.from('services').update({ status: 'running', updated_at: new Date().toISOString() }).eq('id', service.id);
      await refresh();
      setDeploying(null);
    }, 3000);
  };

  const totalReplicas = services.reduce((s, svc) => s + svc.replicas, 0);
  const avgCpu = services.length > 0 ? Math.round(services.reduce((s, svc) => s + svc.cpu_pct, 0) / services.length) : 0;
  const avgMem = services.length > 0 ? Math.round(services.reduce((s, svc) => s + svc.memory_pct, 0) / services.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Server className="h-4 w-4" /> Total Services</div>
          <p className="mt-1 text-2xl font-semibold text-white">{services.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Boxes className="h-4 w-4" /> Total Replicas</div>
          <p className="mt-1 text-2xl font-semibold text-white">{totalReplicas}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Cpu className="h-4 w-4" /> Avg CPU</div>
          <p className="mt-1 text-2xl font-semibold text-white">{avgCpu}%</p>
          <ProgressBar value={avgCpu} colorClass={avgCpu > 70 ? 'bg-amber-500' : 'bg-emerald-500'} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><MemoryStick className="h-4 w-4" /> Avg Memory</div>
          <p className="mt-1 text-2xl font-semibold text-white">{avgMem}%</p>
          <ProgressBar value={avgMem} colorClass={avgMem > 80 ? 'bg-rose-500' : 'bg-blue-500'} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30" />
        </div>
        <div className="flex gap-2">
          {['all', 'running', 'deploying', 'stopped', 'failed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                filter === f ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No services match your filters." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Service</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Version</th>
                  <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 md:table-cell">Replicas</th>
                  <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 lg:table-cell">CPU</th>
                  <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 lg:table-cell">Memory</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((svc) => {
                  const Icon = typeIcons[svc.type] || Server;
                  return (
                    <tr key={svc.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/30 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/60">
                            <Icon className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{svc.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">{svc.image}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="rounded-md bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300 capitalize">{svc.type}</span></td>
                      <td className="px-4 py-3"><code className="text-xs text-blue-300">{svc.version}</code></td>
                      <td className="hidden px-4 py-3 md:table-cell"><span className="text-sm font-medium text-slate-200">{svc.replicas}</span></td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16"><ProgressBar value={svc.cpu_pct} colorClass={svc.cpu_pct > 80 ? 'bg-rose-500' : svc.cpu_pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'} /></div>
                          <span className="text-xs text-slate-400">{svc.cpu_pct}%</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16"><ProgressBar value={svc.memory_pct} colorClass={svc.memory_pct > 80 ? 'bg-rose-500' : 'bg-blue-500'} /></div>
                          <span className="text-xs text-slate-400">{svc.memory_pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={svc.status} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeploy(svc)} disabled={deploying === svc.id || svc.status === 'deploying'}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:border-blue-500/40 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50">
                          <Rocket className="h-3.5 w-3.5" />
                          {deploying === svc.id ? 'Deploying...' : 'Deploy'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
