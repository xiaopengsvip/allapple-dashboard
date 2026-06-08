'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Server, RefreshCw, Play, Square, RotateCw, FileText, Cpu, HardDrive, MemoryStick, Clock, X } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ServersPage() {
  const [pm2, setPm2] = useState<any[]>([]);
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [logsModal, setLogsModal] = useState<{ name: string; logs: string; loading: boolean } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pm2Res, statsRes] = await Promise.all([
        fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
        fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: null })),
      ]);
      setPm2(pm2Res.services || []);
      setStats(statsRes.stats);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);
  const fmtBytes = (b: number) => b > 1e9 ? (b / 1e9).toFixed(1) + ' GB' : (b / 1e6).toFixed(0) + ' MB';
  const fmtUptime = (s: number) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600); return `${d}d ${h}h`; };

  const handleRestart = async (name: string) => {
    if (!confirm(t('servers.confirm_restart', { name }))) return;
    setActionLoading(`restart-${name}`);
    try {
      const res = await fetch(`/api/server/pm2/${encodeURIComponent(name)}/restart`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(t('servers.restart_success'));
        fetchData();
      } else {
        alert(data.error || t('servers.action_failed'));
      }
    } catch { alert(t('servers.action_failed')); }
    setActionLoading(null);
  };

  const handleStop = async (name: string) => {
    if (!confirm(t('servers.confirm_stop', { name }))) return;
    setActionLoading(`stop-${name}`);
    try {
      const res = await fetch(`/api/server/pm2/${encodeURIComponent(name)}/stop`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(t('servers.stop_success'));
        fetchData();
      } else {
        alert(data.error || t('servers.action_failed'));
      }
    } catch { alert(t('servers.action_failed')); }
    setActionLoading(null);
  };

  const handleLogs = async (name: string) => {
    setLogsModal({ name, logs: '', loading: true });
    try {
      const res = await fetch(`/api/server/pm2/${encodeURIComponent(name)}/logs`);
      const data = await res.json();
      setLogsModal({ name, logs: data.logs || data.error || t('servers.no_logs'), loading: false });
    } catch {
      setLogsModal({ name, logs: t('servers.action_failed'), loading: false });
    }
  };

  return (
    <AppShell>
      <TopBar title={t("servers.title")} subtitle={t("servers.subtitle")} />
      <div style={{ padding: 24,  }}>
        {/* System Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { icon: Cpu, label: t('dashboard.cpu'), value: `${stats.cpu.cores} cores`, sub: `Load: ${stats.cpu.loadAvg.join(' / ')}`, color: '#4D7FFF' },
              { icon: MemoryStick, label: t('dashboard.memory'), value: `${Math.round(stats.memory.used / stats.memory.total * 100)}%`, sub: `${fmtBytes(stats.memory.used)} / ${fmtBytes(stats.memory.total)}`, color: '#A78BFA' },
              { icon: HardDrive, label: t('dashboard.disk'), value: `${Math.round(stats.disk.used / stats.disk.total * 100)}%`, sub: `${fmtBytes(stats.disk.used)} / ${fmtBytes(stats.disk.total)}`, color: '#F59E0B' },
              { icon: Clock, label: t('dashboard.uptime'), value: fmtUptime(stats.uptime), sub: `${stats.hostname} · ${stats.arch}`, color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '20px 22px', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{s.label}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}10` }}><s.icon style={{ width: 16, height: 16, color: s.color }} /></div>
                </div>
                <div>
                  <div className="stat-value" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PM2 */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{t("servers.pm2_processes")}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 600 }}>{pm2.filter(s => s.status === 'online').length}/{pm2.length} {t("servers.online")}</span>
              <button onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, fontSize: 11, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
                <RefreshCw style={{ width: 12, height: 12, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("servers.refresh")}
              </button>
            </div>
          </div>
          {pm2.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < pm2.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: s.status === 'online' ? 'var(--success)' : 'var(--error)', boxShadow: s.status === 'online' ? '0 0 8px rgba(16,185,129,0.4)' : 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>PID {s.pid} · {s.memory ? fmtBytes(s.memory) : '—'} · CPU {s.cpu || 0}%</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { icon: RotateCw, tip: t('servers.restart'), color: 'var(--accent)', action: () => handleRestart(s.name), loadingKey: `restart-${s.name}` },
                  { icon: Square, tip: t('servers.stop'), color: 'var(--error)', action: () => handleStop(s.name), loadingKey: `stop-${s.name}` },
                  { icon: FileText, tip: t('servers.logs'), color: 'var(--text-muted)', action: () => handleLogs(s.name), loadingKey: null },
                ].map(b => (
                  <button key={b.tip} title={b.tip} onClick={b.action} disabled={actionLoading === b.loadingKey}
                    style={{ padding: 7, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: `all 150ms ${EASE}`, opacity: actionLoading === b.loadingKey ? 0.5 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = b.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    <b.icon style={{ width: 14, height: 14, animation: actionLoading === b.loadingKey ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                ))}
              </div>
            </div>
          ))}
          {pm2.length === 0 && <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? t('common.loading') : t('dashboard.no_pm2')}</div>}
        </div>
      </div>

      {/* Logs Modal */}
      {logsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setLogsModal(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', background: 'var(--bg-surface)', borderRadius: 20, padding: 24, width: 700, maxWidth: '90vw', maxHeight: '80vh', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{t("servers.pm2_logs")} — {logsModal.name}</h3>
              <button onClick={() => setLogsModal(null)} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-root)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
              {logsModal.loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>{t("servers.fetching_logs")}</div>
              ) : (
                <pre style={{ margin: 0, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 }}>{logsModal.logs}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </AppShell>
  );
}
