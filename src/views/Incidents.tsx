import { useState } from 'react';
import { AlertTriangle, CheckCircle2, MapPin, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useIncidents, useRegions } from '@/hooks/useData';
import { StatusBadge, SeverityBadge, LoadingState, EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/lib/theme';

export function IncidentsView() {
  const { incidents, loading, error } = useIncidents();
  const { regions } = useRegions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  if (loading) return <LoadingState message="Loading incidents..." />;

  const filtered = filter === 'all' ? incidents : incidents.filter((i) => i.status === filter);
  const active = incidents.filter((i) => i.status !== 'resolved').length;
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const sev1Count = incidents.filter((i) => i.severity === 'sev1').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><AlertTriangle className="h-4 w-4" /> Active</div>
          <p className="mt-1 text-2xl font-semibold text-white">{active}</p>
          <p className="text-xs text-amber-400">needs attention</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4" /> Resolved</div>
          <p className="mt-1 text-2xl font-semibold text-white">{resolved}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><AlertTriangle className="h-4 w-4" /> SEV1 Critical</div>
          <p className="mt-1 text-2xl font-semibold text-white">{sev1Count}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="h-4 w-4" /> Total</div>
          <p className="mt-1 text-2xl font-semibold text-white">{incidents.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500" />
        {['all', 'investigating', 'identified', 'monitoring', 'resolved'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
              filter === f ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
            }`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No incidents found." />
      ) : (
        <div className="space-y-3">
          {filtered.map((inc) => {
            const region = regions.find((r) => r.code === inc.region_code);
            const isExpanded = expanded === inc.id;
            return (
              <div key={inc.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700">
                <button onClick={() => setExpanded(isExpanded ? null : inc.id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <div className="flex items-center gap-3">
                    {inc.status === 'resolved' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> :
                      <AlertTriangle className={`h-5 w-5 ${inc.severity === 'sev1' ? 'text-rose-400' : 'text-amber-400'}`} />}
                    <div>
                      <p className="text-sm font-medium text-white">{inc.title}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {inc.region_code}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatRelativeTime(inc.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-800/60 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Description</p>
                        <p className="text-sm text-slate-300">{inc.description}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">Affected Services</p>
                        <div className="flex flex-wrap gap-1.5">
                          {inc.affected_services.map((svc) => (
                            <span key={svc} className="rounded-md bg-slate-800/60 px-2 py-1 text-xs text-slate-300">{svc}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5">
                        <p className="text-[10px] uppercase text-slate-500">Region</p>
                        <p className="text-sm font-medium text-white">{region?.name || inc.region_code}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5">
                        <p className="text-[10px] uppercase text-slate-500">Severity</p>
                        <p className="text-sm font-medium text-white capitalize">{inc.severity}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5">
                        <p className="text-[10px] uppercase text-slate-500">Started</p>
                        <p className="text-sm font-medium text-white">{new Date(inc.created_at).toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5">
                        <p className="text-[10px] uppercase text-slate-500">Resolved</p>
                        <p className="text-sm font-medium text-white">{inc.resolved_at ? new Date(inc.resolved_at).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  );
}
