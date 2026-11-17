import { useState } from 'react';
import { Sidebar, type ViewKey } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { DashboardView } from '@/views/Dashboard';
import { RegionsView } from '@/views/Regions';
import { ServicesView } from '@/views/Services';
import { DeploymentsView } from '@/views/Deployments';
import { IncidentsView } from '@/views/Incidents';
import { MetricsView } from '@/views/Metrics';
import { useIncidents } from '@/hooks/useData';

const viewMeta: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Real-time infrastructure overview' },
  regions: { title: 'Regions', subtitle: 'Multi-region active-active status & health' },
  services: { title: 'Services', subtitle: 'Manage workloads across all regions' },
  deployments: { title: 'Deployments', subtitle: 'Deployment history & rollout tracking' },
  incidents: { title: 'Incidents', subtitle: 'Active incidents & post-mortems' },
  metrics: { title: 'Metrics', subtitle: 'Performance telemetry & dashboards' },
};

function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const { incidents } = useIncidents();
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved').length;
  const meta = viewMeta[view];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar active={view} onSelect={setView} incidentCount={activeIncidents} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div key={view} className="animate-fade-in">
            {view === 'dashboard' && <DashboardView onNavigate={setView} />}
            {view === 'regions' && <RegionsView />}
            {view === 'services' && <ServicesView />}
            {view === 'deployments' && <DeploymentsView />}
            {view === 'incidents' && <IncidentsView />}
            {view === 'metrics' && <MetricsView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
