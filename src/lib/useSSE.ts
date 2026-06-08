'use client';
import { useEffect, useRef, useCallback, useState } from 'react';

export function useSSE(url: string, onMessage?: (data: any) => void) {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => {
      setConnected(false);
      // Auto-reconnect after 5s
      setTimeout(() => {
        if (esRef.current?.readyState === EventSource.CLOSED) {
          esRef.current = new EventSource(url);
        }
      }, 5000);
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLastEvent(data);
        onMessage?.(data);
      } catch {}
    };

    return () => { es.close(); esRef.current = null; };
  }, [url]);

  return { connected, lastEvent };
}

/** Polling hook as fallback - fetches data at interval */
export function usePolling(url: string, intervalMs: number = 30000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const d = await res.json();
      setData(d);
    } catch {}
    setLoading(false);
  }, [url]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [refresh, intervalMs]);

  return { data, loading, refresh };
}
