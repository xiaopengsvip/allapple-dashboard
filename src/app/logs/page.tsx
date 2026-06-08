'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { RefreshCw, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const PAGE_SIZE = 20;

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `/api/logs?limit=500`;
      if (actionFilter) url += `&action=${encodeURIComponent(actionFilter)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      if (dateFrom) url += `&from=${encodeURIComponent(dateFrom)}`;
      if (dateTo) url += `&to=${encodeURIComponent(dateTo)}`;
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [actionFilter, statusFilter, dateFrom, dateTo]);

  const statusColor: Record<string, string> = { success: 'var(--success)', failed: 'var(--error)', warning: 'var(--warning)' };
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paged = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const actionTypes = [...new Set(logs.map(l => l.action))].filter(Boolean);

  const handleExport = () => {
    const csv = ['Time,Action,Target,Detail,Status', ...logs.map(l =>
      `"${new Date(l.created_at).toLocaleString()}","${l.action}","${l.target || ''}","${l.detail || ''}","${l.status}"`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `logs-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <TopBar title={t("logs.title")} subtitle={t("logs.subtitle")} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{logs.length} {t("logs.records")}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: showFilters ? 'var(--accent-soft)' : 'var(--bg-card)', color: showFilters ? 'var(--accent)' : 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <Filter style={{ width: 13, height: 13 }} /> {t("logs.refresh")}
            </button>
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <Download style={{ width: 13, height: 13 }} /> CSV
            </button>
            <button onClick={fetchLogs} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("logs.refresh")}
            </button>
          </div>
        </div>

        {showFilters && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">{t("logs.action")}</option>
              {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">{t("logs.status")}</option>
              <option value="success">success</option>
              <option value="failed">failed</option>
              <option value="warning">warning</option>
            </select>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>~</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            <button onClick={() => { setActionFilter(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[t('logs.time'), t('logs.action'), t('logs.target'), t('logs.detail'), t('logs.status')].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {paged.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < paged.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{l.action}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{l.target}</td>
                  <td style={{ padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{l.detail}</td>
                  <td style={{ padding: '12px 20px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${statusColor[l.status] || 'var(--text-muted)'}15`, color: statusColor[l.status] || 'var(--text-muted)' }}>{l.status}</span></td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? t('common.loading') : t('logs.no_logs')}</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', opacity: page === 1 ? 0.3 : 1 }}>
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', opacity: page === totalPages ? 0.3 : 1 }}>
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </AppShell>
  );
}
