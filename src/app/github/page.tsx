'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitFork, ExternalLink, Star, Lock, Globe, RefreshCw, Search } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function GitHubPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => { setLoading(true); try { const res = await fetch('/api/github/repos'); const data = await res.json(); setRepos(data.repos || []); } catch {} setLoading(false); };
  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <TopBar title="GitHub" subtitle="仓库管理" />
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{repos.length} 仓库</span>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input type="text" placeholder="搜索仓库..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 180, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={fetchRepos} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 刷新
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, transition: `all 250ms ${EASE}`, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GitFork style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
                  {r.private ? <Lock style={{ width: 12, height: 12, color: 'var(--warning)' }} /> : <Globe style={{ width: 12, height: 12, color: 'var(--success)' }} />}
                </div>
                <a href={r.html_url} target="_blank" style={{ color: 'var(--text-muted)' }}><ExternalLink style={{ width: 14, height: 14 }} /></a>
              </div>
              {r.description && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{r.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
                {r.language && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />{r.language}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star style={{ width: 10, height: 10 }} />{r.stargazers_count}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><GitFork style={{ width: 10, height: 10 }} />{r.forks_count}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{loading ? '加载中...' : '暂无数据，请在设置中配置 GitHub Token'}</div>}
        </div>
      </div>
    </AppShell>
  );
}
