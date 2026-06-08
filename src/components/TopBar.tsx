'use client';

import { Search, Bell, X, Package, Globe, GitFork, Server, ExternalLink, Clock, CheckCircle2, AlertTriangle, Rocket } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifs(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load projects for search
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setAllProjects(d.projects || [])).catch(() => {});
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = allProjects.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.domain?.toLowerCase().includes(q) ||
      p.github_repo?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ).slice(0, 8);
    setSearchResults(results);
  }, [searchQuery, allProjects]);

  // Focus search input when opened
  useEffect(() => { if (showSearch) setTimeout(() => searchRef.current?.focus(), 100); }, [showSearch]);

  const notifications = [
    { id: 1, type: 'success', text: 'dashboard 重新部署成功', time: '23:41', icon: CheckCircle2 },
    { id: 2, type: 'success', text: 'Everett 运维中心 v1.0 构建完成', time: '23:38', icon: Rocket },
    { id: 3, type: 'info', text: 'allapple-dashboard pushed to main', time: '23:33', icon: GitFork },
    { id: 4, type: 'warning', text: '端口 3400 被占用，自动清理完成', time: '23:22', icon: AlertTriangle },
  ];

  const weekDay = ['日', '一', '二', '三', '四', '五', '六'];
  const fmtBJ = () => {
    const bj = new Date(now.getTime() + 8 * 3600000);
    return `${bj.getUTCFullYear()}/${String(bj.getUTCMonth() + 1).padStart(2, '0')}/${String(bj.getUTCDate()).padStart(2, '0')} 周${weekDay[bj.getUTCDay()]} ${String(bj.getUTCHours()).padStart(2, '0')}:${String(bj.getUTCMinutes()).padStart(2, '0')}:${String(bj.getUTCSeconds()).padStart(2, '0')}`;
  };
  const fmtUTC = () => `UTC ${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;

  return (
    <>
      <header style={{
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--bg-root)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
        </div>
        <div style={{ flex: 1 }} />

        {/* Search Bar */}
        <div onClick={() => setShowSearch(true)} style={{
          display: 'flex', alignItems: 'center', width: 240, padding: '8px 12px', borderRadius: 12,
          background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer',
          transition: `all 150ms ${EASE}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <Search style={{ width: 14, height: 14, marginRight: 8, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, flex: 1, color: 'var(--text-muted)' }}>搜索项目、域名...</span>
          <kbd style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 500 }}>⌘K</kbd>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{
            position: 'relative', padding: 8, borderRadius: 10, background: showNotifs ? 'var(--bg-card)' : 'transparent',
            border: showNotifs ? '1px solid var(--border)' : '1px solid transparent', cursor: 'pointer', color: 'var(--text-muted)',
            transition: `all 150ms ${EASE}`,
          }}>
            <Bell style={{ width: 18, height: 18 }} />
            <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
          </button>

          {/* Notification Panel */}
          {showNotifs && createPortal(
            <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowNotifs(false)}>
              <div style={{
                position: 'absolute', top: 60, right: 24, width: 360, maxHeight: 400,
                background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)', overflow: 'hidden',
              }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>通知</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--error-soft)', color: 'var(--error)', fontWeight: 600 }}>{notifications.length}</span>
                    <button onClick={() => setShowNotifs(false)} style={{ padding: 4, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: `all 150ms ${EASE}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
                <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                  {notifications.map((n, i) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 18px',
                        borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: `background 150ms ${EASE}`, cursor: 'pointer',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: n.type === 'success' ? 'var(--success-soft)' : n.type === 'warning' ? 'var(--warning-soft)' : 'var(--accent-soft)', flexShrink: 0, marginTop: 2 }}>
                          <Icon style={{ width: 16, height: 16, color: n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--accent)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>, document.body
          )}
        </div>

        {/* Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#4D7FFF' }}>{fmtBJ()}</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{fmtUTC()}</span>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '15vh' }} onClick={() => setShowSearch(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'relative', width: 560, maxHeight: 480,
            background: 'var(--bg-card)', borderRadius: 20,
            border: '1px solid var(--border)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
              <Search style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0 }} />
              <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索项目、域名、GitHub 仓库..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: 'var(--text-primary)' }}
              />
              <button onClick={() => setShowSearch(false)} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: `all 150ms ${EASE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 380, overflowY: 'auto', padding: 8 }}>
              {searchQuery.trim() === '' ? (
                <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>快速访问</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                    {allProjects.slice(0, 8).map(p => (
                      <a key={p.id} href={p.domain ? `https://${p.domain}` : '#'} target="_blank" rel="noopener noreferrer"
                        onClick={() => setShowSearch(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10,
                          background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 11,
                          color: 'var(--text-secondary)', textDecoration: 'none', transition: `all 150ms ${EASE}`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color || '#4D7FFF' }} />
                        {p.name}
                      </a>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((p, i) => (
                  <a key={p.id} href={p.domain ? `https://${p.domain}` : '#'} target="_blank" rel="noopener noreferrer"
                    onClick={() => setShowSearch(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12,
                      textDecoration: 'none', transition: `background 150ms ${EASE}`,
                      borderBottom: i < searchResults.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: p.color, background: `${p.color}12`, flexShrink: 0 }}>
                      {p.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{p.category} · {p.domain || '—'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.status === 'active' ? 'var(--success)' : 'var(--warning)' }} />
                      {p.domain && <ExternalLink style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />}
                    </div>
                  </a>
                ))
              ) : (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>没有找到匹配的结果</div>
                </div>
              )}
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
