import { Cloud, LayoutDashboard, Globe2, Server, Rocket, AlertTriangle, Activity } from 'lucide-react';

export type ViewKey = 'dashboard' | 'regions' | 'services' | 'deployments' | 'incidents' | 'metrics';

interface NavItem { key: ViewKey; label: string; icon: typeof LayoutDashboard; }

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'regions', label: 'Regions', icon: Globe2 },
  { key: 'services', label: 'Services', icon: Server },
  { key: 'deployments', label: 'Deployments', icon: Rocket },
  { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { key: 'metrics', label: 'Metrics', icon: Activity },
];

export function Sidebar({ active, onSelect, incidentCount }: {
  active: ViewKey; onSelect: (key: ViewKey) => void; incidentCount: number;
}) {
  return (
    <aside className="flex w-16 flex-col border-r border-slate-800 bg-slate-950/80 lg:w-60">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-4 lg:px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
          <Cloud className="h-5 w-5 text-white" />
        </div>
        <span className="hidden text-lg font-bold tracking-tight text-white lg:block">
          Twin<span className="text-blue-400">Cloud</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-2 lg:p-3">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => onSelect(item.key)}
              className={`group relative flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all lg:justify-start ${
                isActive ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`} title={item.label}>
              {isActive && <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-blue-400" />}
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
              {item.key === 'incidents' && incidentCount > 0 && (
                <span className="absolute right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white lg:static">
                  {incidentCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="hidden border-t border-slate-800 p-3 lg:block">
        <div className="rounded-lg bg-slate-900/60 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-600">Active-Active Replication ON</p>
        </div>
      </div>
    </aside>
  );
}
