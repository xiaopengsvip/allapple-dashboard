'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitFork, ExternalLink, Star, Lock, Globe, RefreshCw, Search } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function GitHubPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => { setLoading(true); try { const res = await fetch('/api/github/repos'); const data = await res.json(); setRepos(data.repos || []); } catch {} setLoading(false); };
  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <TopBar title={t("github.title")} subtitle={t("github.subtitle")} />
      <div style={{ padding: 24,  }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{repos.length} {t("github.repos")}</span>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t("github.search")} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 180, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={fetchRepos} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("github.refresh")}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, transition: `all 250ms ${EASE}`, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GitFork style={{ width: 16, height: 16, color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
                </div>
                {r.private ? <Lock style={{ width: 14, height: 14, color: 'var(--text-muted)' }} /> : <Globe style={{ width: 14, height: 14, color: 'var(--success)' }} />}
              </div>
              {r.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{r.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-muted)' }}>
                {r.language && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />{r.language}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star style={{ width: 12, height: 12 }} />{r.stargazers_count}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitFork style={{ width: 12, height: 12 }} />{r.forks_count}</span>
                <a href={r.html_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', color: 'var(--accent)', textDecoration: 'none' }}><ExternalLink style={{ width: 12, height: 12 }} /></a>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? t('common.loading') : t('github.no_data')}</div>}
        </div>
      </div>
    </AppShell>
  );
}
