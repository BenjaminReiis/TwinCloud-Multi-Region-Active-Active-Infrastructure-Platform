export const colors = {
  primary: {
    50: '#eef6ff', 100: '#d9ebff', 200: '#bcdcff', 300: '#8ec6ff',
    400: '#59a5ff', 500: '#3380ff', 600: '#1d60f5', 700: '#1749e1',
    800: '#193db6', 900: '#1a388f', 950: '#142457',
  },
  accent: {
    50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
    400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
    800: '#065f46', 900: '#064e3b',
  },
  success: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
  warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
  error: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
} as const;

export const statusConfig = {
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  degraded: { label: 'Degraded', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  maintenance: { label: 'Maintenance', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  offline: { label: 'Offline', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  running: { label: 'Running', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  deploying: { label: 'Deploying', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  stopped: { label: 'Stopped', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-400' },
  failed: { label: 'Failed', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  pending: { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  succeeded: { label: 'Succeeded', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  rolled_back: { label: 'Rolled Back', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  investigating: { label: 'Investigating', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  identified: { label: 'Identified', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  monitoring: { label: 'Monitoring', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  resolved: { label: 'Resolved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
} as const;

export const severityConfig = {
  sev1: { label: 'SEV1', color: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/40' },
  sev2: { label: 'SEV2', color: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/40' },
  sev3: { label: 'SEV3', color: 'text-sky-300', bg: 'bg-sky-500/15', border: 'border-sky-500/40' },
  sev4: { label: 'SEV4', color: 'text-slate-300', bg: 'bg-slate-500/15', border: 'border-slate-500/40' },
} as const;

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function formatDuration(ms: number): string {
  if (ms === 0) return '—';
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
