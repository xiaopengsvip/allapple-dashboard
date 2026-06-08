'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Globe, RefreshCw, Search } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function DomainsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState('all');
  const [search, setSearch] = useState('');

  const fetchDomains = async () => { setLoading(true); try { const res = await fetch('/api/domains'); const data = await res.json(); setRecords(data.records || []); } catch {} setLoading(false); };
  useEffect(() => { fetchDomains(); }, []);

  const filtered = records.filter(r => { if (zone !== 'all' && r.zone_name !== zone) return false; if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false; return true; });

  return (
    <AppShell>
      <TopBar title={t("domains.title")} subtitle={t("domains.subtitle")} />
      <div style={{ padding: 24,  }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'allapple.top', 'vios.top'].map(z => (
              <button key={z} onClick={() => setZone(z)} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: zone === z ? 'var(--accent-soft)' : 'var(--bg-card)', color: zone === z ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${zone === z ? 'rgba(77,127,255,0.2)' : 'var(--border)'}`, transition: `all 150ms ${EASE}` }}>
                {z === 'all' ? t('domains.all') : z} ({z === 'all' ? records.length : records.filter(r => r.zone_name === z).length})
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t("domains.search")} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 180, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={fetchDomains} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("domains.refresh")}
          </button>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[t('domains.type'), t('domains.name'), t('domains.target'), t('domains.proxy'), t('domains.zone')].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 20px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600 }}>{r.type}</span></td>
                  <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{r.name}</td>
                  <td style={{ padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{r.content}</td>
                  <td style={{ padding: '12px 20px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: r.proxied ? 'var(--warning-soft)' : 'var(--bg-elevated)', color: r.proxied ? 'var(--warning)' : 'var(--text-muted)' }}>{r.proxied ? 'PROXY' : 'DNS'}</span></td>
                  <td style={{ padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)' }}>{r.zone_name}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? t('common.loading') : t('domains.no_data')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
