'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { RefreshCw, Clock } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchLogs = async () => { setLoading(true); try { const res = await fetch('/api/logs?limit=100'); const data = await res.json(); setLogs(data.logs || []); } catch {} setLoading(false); };
  useEffect(() => { fetchLogs(); }, []);

  const statusColor: Record<string, string> = { success: 'var(--success)', failed: 'var(--error)', warning: 'var(--warning)' };

  return (
    <AppShell>
      <TopBar title="日志中心" subtitle="操作审计日志" />
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{logs.length} 条记录</span>
          <button onClick={fetchLogs} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 刷新
          </button>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['时间', '操作', '目标', '详情', '状态'].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 20px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{new Date(l.created_at).toLocaleString('zh-CN')}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{l.action}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{l.target}</td>
                  <td style={{ padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{l.detail}</td>
                  <td style={{ padding: '12px 20px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${statusColor[l.status] || 'var(--text-muted)'}15`, color: statusColor[l.status] || 'var(--text-muted)' }}>{l.status}</span></td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? '加载中...' : '暂无日志'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
