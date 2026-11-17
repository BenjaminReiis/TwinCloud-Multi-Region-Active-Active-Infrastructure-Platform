import { useState, useEffect, useCallback } from 'react';
import { Bolt Database } from '@/lib/supabase';
import type { Region, Service, Deployment, Incident, Metric } from '@/lib/supabase';

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('regions').select('*').order('name');
    if (error) setError(error.message);
    else setRegions(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { regions, loading, error, refresh };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error) setError(error.message);
    else setServices(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { services, loading, error, refresh };
}

export function useDeployments(limit = 20) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await Bolt Database
      .from('deployments').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) setError(error.message);
    else setDeployments(data || []);
    setLoading(false);
  }, [limit]);
  useEffect(() => { refresh(); }, [refresh]);
  return { deployments, loading, error, refresh };
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await Bolt Database
      .from('incidents').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setIncidents(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { incidents, loading, error, refresh };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await Bolt Database
      .from('metrics').select('*').order('recorded_at', { ascending: true });
    if (error) setError(error.message);
    else setMetrics(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { metrics, loading, error, refresh };
}

export function useSimulatedMetrics(active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [active]);
  return tick;
}
