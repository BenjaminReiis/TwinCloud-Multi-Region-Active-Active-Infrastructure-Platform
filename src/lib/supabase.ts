import { createClient } from '@supabase/Bolt Database-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const Bolt Database = createClient(supabaseUrl, supabaseAnonKey);

export type RegionStatus = 'active' | 'degraded' | 'maintenance' | 'offline';
export type ServiceStatus = 'running' | 'deploying' | 'stopped' | 'failed';
export type DeploymentStatus = 'pending' | 'in_progress' | 'succeeded' | 'failed' | 'rolled_back';
export type IncidentSeverity = 'sev1' | 'sev2' | 'sev3' | 'sev4';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type MetricType = 'requests_per_sec' | 'latency' | 'error_rate' | 'cpu' | 'memory';

export interface Region {
  id: string;
  name: string;
  code: string;
  continent: string;
  status: RegionStatus;
  latency_ms: number;
  uptime_pct: number;
  load_pct: number;
  instances: number;
  coordinates: { lat: number; lng: number };
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  version: string;
  replicas: number;
  cpu_pct: number;
  memory_pct: number;
  image: string;
  port: number;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  service_id: string;
  version: string;
  status: DeploymentStatus;
  region_code: string;
  trigger: string;
  duration_ms: number;
  log: string;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  region_code: string;
  description: string;
  affected_services: string[];
  created_at: string;
  resolved_at: string | null;
}

export interface Metric {
  id: string;
  region_code: string;
  metric_type: MetricType;
  value: number;
  recorded_at: string;
}
