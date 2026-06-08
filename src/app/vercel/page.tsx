'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Cloud, ExternalLink, RefreshCw, Search, Clock } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function VercelPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => { setLoading(true); try { const res = await fetch('/api/vercel/projects'); const data = await res.json(); setProjects(data.projects || []); } catch {} setLoading(false); };
  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <TopBar title={t("vercel.title")} subtitle={t("vercel.subtitle")} />
      <div style={{ padding: 24,  }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{projects.length} {t("vercel.projects")}</span>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t("vercel.search")} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 180, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={fetchProjects} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("vercel.refresh")}
          </button>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[t('vercel.projects'), t('domains.name'), t('vercel.framework'), t('vercel.last_update'), t('vercel.link')].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Cloud style={{ width: 14, height: 14, color: 'var(--accent)' }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span></div></td>
                  <td style={{ padding: '12px 20px' }}>{p.targets?.production?.alias?.[0] ? <a href={`https://${p.targets.production.alias[0]}`} target="_blank" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{p.targets.production.alias[0]}</a> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '12px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.framework || '—'}</td>
                  <td style={{ padding: '12px 20px' }}><span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}><Clock style={{ width: 12, height: 12 }} />{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</span></td>
                  <td style={{ padding: '12px 20px' }}><a href={`https://${p.name}.vercel.app`} target="_blank" style={{ color: 'var(--accent)' }}><ExternalLink style={{ width: 14, height: 14 }} /></a></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? t('common.loading') : t('vercel.no_data')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
