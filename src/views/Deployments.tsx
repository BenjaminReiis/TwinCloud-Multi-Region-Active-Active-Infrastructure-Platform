import { useState } from 'react';
import { Rocket, CheckCircle2, XCircle, RotateCcw, Clock, MapPin, User, Zap } from 'lucide-react';
import { useDeployments, useServices } from '@/hooks/useData';
import { StatusBadge, LoadingState, EmptyState } from '@/components/ui';
import { formatRelativeTime, formatDuration } from '@/lib/theme';
import type { DeploymentStatus } from '@/lib/supabase';

const statusIcon: Record<string, typeof Rocket> = {
  succeeded: CheckCircle2, failed: XCircle, in_progress: Clock, pending: Clock, rolled_back: RotateCcw,
};
const statusColor: Record<string, string> = {
  succeeded: 'text-emerald-400', failed: 'text-rose-400', in_progress: 'text-sky-400', pending: 'text-slate-400', rolled_back: 'text-amber-400',
};
const triggerIcon: Record<string, typeof Rocket> = {
  manual: User, auto_scale: Zap, rollback: RotateCcw, scheduled: Clock,
};

export function DeploymentsView() {
  const { deployments, loading, error } = useDeployments(50);
  const { services } = useServices();
  const [filter, setFilter] = useState<DeploymentStatus | 'all'>('all');

  if (loading) return <LoadingState message="Loading deployments..." />;

  const serviceMap = new Map(services.map((s) => [s.id, s]));
  const filtered = filter === 'all' ? deployments : deployments.filter((d) => d.status === filter);
  const succeeded = deployments.filter((d) => d.status === 'succeeded').length;
  const failed = deployments.filter((d) => d.status === 'failed').length;
  const inProgress = deployments.filter((d) => d.status === 'in_progress').length;
  const successRate = deployments.length > 0 ? Math.round((succeeded / deployments.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Rocket className="h-4 w-4" /> Total</div>
          <p className="mt-1 text-2xl font-semibold text-white">{deployments.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4" /> Success Rate</div>
          <p className="mt-1 text-2xl font-semibold text-white">{successRate}%</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><XCircle className="h-4 w-4" /> Failed</div>
          <p className="mt-1 text-2xl font-semibold text-white">{failed}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="h-4 w-4" /> In Progress</div>
          <p className="mt-1 text-2xl font-semibold text-white">{inProgress}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'in_progress', 'succeeded', 'failed', 'rolled_back', 'pending'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
              filter === f ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
            }`}>{f.replace('_', ' ')}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No deployments found." />
      ) : (
        <div className="relative space-y-4">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-slate-800" />
          {filtered.map((dep) => {
            const svc = serviceMap.get(dep.service_id);
            const Icon = statusIcon[dep.status] || Rocket;
            const color = statusColor[dep.status] || 'text-slate-400';
            const TriggerIcon = triggerIcon[dep.trigger] || User;
            return (
              <div key={dep.id} className="relative flex gap-4">
                <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{svc?.name || 'Unknown Service'}</span>
                      <code className="rounded bg-slate-800/60 px-2 py-0.5 text-xs text-blue-300">{dep.version}</code>
                    </div>
                    <StatusBadge status={dep.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {dep.region_code}</span>
                    <span className="flex items-center gap-1"><TriggerIcon className="h-3 w-3" /> {dep.trigger}</span>
                    {dep.duration_ms > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration(dep.duration_ms)}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatRelativeTime(dep.created_at)}</span>
                  </div>
                  {dep.log && (
                    <div className="mt-3 rounded-lg border border-slate-800/60 bg-slate-950/60 p-2.5">
                      <p className="font-mono text-xs text-slate-400">{dep.log}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
