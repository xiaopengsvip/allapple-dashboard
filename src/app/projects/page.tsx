'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Plus, Search, ExternalLink, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', transition: `box-shadow 250ms ${EASE}, border-color 250ms ${EASE}`, ...style }}>{children}</div>;
}

const catKeyMap: Record<string, string> = { '品牌官网': 'branding', '工作台': 'workspace', 'AI应用': 'ai_apps', '数据可视化': 'data_viz', '工具': 'tools', '媒体': 'media', '教育': 'education' };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', category: '工具', deploy_target: 'vercel', domain: '', github_repo: '', color: '#4D7FFF', description: '' });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);

  const categories = [
    { key: 'all', zh: '全部', en: 'All' },
    { key: 'branding', zh: '品牌官网', en: 'Branding' },
    { key: 'workspace', zh: '工作台', en: 'Workspace' },
    { key: 'ai_apps', zh: 'AI应用', en: 'AI Apps' },
    { key: 'data_viz', zh: '数据可视化', en: 'Data Viz' },
    { key: 'tools', zh: '工具', en: 'Tools' },
    { key: 'media', zh: '媒体', en: 'Media' },
    { key: 'education', zh: '教育', en: 'Education' },
  ];
  const filtered = projects.filter(p => {
    const catMap: Record<string, string> = { branding: '品牌官网', workspace: '工作台', ai: 'AI应用', dataviz: '数据可视化', tools: '工具', media: '媒体', education: '教育' };
    if (filter !== 'all' && p.category !== catMap[filter]) return false;
    if (platformFilter === 'vercel' && p.deploy_target !== 'vercel' && p.deploy_target !== 'both') return false;
    if (platformFilter === 'server' && p.deploy_target !== 'server' && p.deploy_target !== 'both') return false;
    if (platformFilter === 'both' && p.deploy_target !== 'both') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProject) });
    const d = await res.json();
    if (d.project) { setProjects([d.project, ...projects]); setShowNew(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('projects.confirm_delete'))) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <AppShell>
      <TopBar title={t("projects.title")} subtitle={t("projects.subtitle")} />
      <div style={{ padding: 24,  }}>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c.key} onClick={() => setFilter(c.key)} style={{
                padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: filter === c.key ? 'var(--accent-soft)' : 'var(--bg-card)',
                color: filter === c.key ? 'var(--accent)' : 'var(--text-muted)',
                border: `1px solid ${filter === c.key ? 'rgba(77,127,255,0.2)' : 'var(--border)'}`,
                transition: `all 150ms ${EASE}`,
              }}>{t(`projects.${c.key}`) || c.zh} ({c.key === 'all' ? projects.length : projects.filter(p => p.category === c.zh).length})</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', t('projects.all')], ['vercel', '▲ Vercel'], ['server', '🖥 Server'], ['both', '🔗 Dual']].map(([k, v]) => (
              <button key={k} onClick={() => setPlatformFilter(k)} style={{
                padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                background: platformFilter === k ? 'var(--accent-soft)' : 'transparent',
                color: platformFilter === k ? 'var(--accent)' : 'var(--text-muted)',
                border: 'none', transition: `all 150ms ${EASE}`,
              }}>{v}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input type="text" placeholder={t("projects.search")} value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 160, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <Plus style={{ width: 14, height: 14 }} /> {t("projects.new")}
          </button>
        </div>

        {/* New Project Modal */}
        {showNew && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowNew(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
            <div style={{ position: 'relative', background: 'var(--bg-surface)', borderRadius: 20, padding: 32, width: 440, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>{t("projects.new")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input placeholder={t("projects.project_name")} value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input placeholder={t("projects.description")} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                    {categories.filter(c => c.key !== 'all').map(c => <option key={c.key} value={c.zh}>{t(`projects.${c.key}`) || c.zh}</option>)}
                  </select>
                  <select value={newProject.deploy_target} onChange={e => setNewProject({...newProject, deploy_target: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                    <option value="vercel">Vercel</option><option value="server">服务器</option><option value="both">双部署</option>
                  </select>
                </div>
                <input placeholder="域名" value={newProject.domain} onChange={e => setNewProject({...newProject, domain: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input placeholder={t("projects.github_repo")} value={newProject.github_repo} onChange={e => setNewProject({...newProject, github_repo: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>{t("projects.cancel")}</button>
                  <button onClick={handleCreate} disabled={!newProject.name} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', opacity: newProject.name ? 1 : 0.4 }}>{t("projects.create")}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <Card style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {[t('projects.name'), t('projects.category'), t('projects.platform'), t('projects.domain'), 'GitHub', t('projects.status'), t('projects.actions')].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '14px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || '#4D7FFF', flexShrink: 0 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span></div></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: `${p.color}12`, color: `${p.color}cc` }}>{t('projects.' + (catKeyMap[p.category] || 'tools')) || p.category}</span></td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.deploy_target === 'vercel' ? '▲ Vercel' : p.deploy_target === 'server' ? '🖥 Server' : '🔗 Both'}</td>
                  <td style={{ padding: '14px 20px' }}>{p.domain ? <a href={`https://${p.domain}`} target="_blank" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{p.domain}</a> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '14px 20px' }}>{p.github_repo ? <a href={`https://github.com/xiaopengsvip/${p.github_repo}`} target="_blank" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{p.github_repo}</a> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '14px 20px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: p.status === 'active' ? 'var(--success)' : 'var(--warning)' }} />{p.status === 'active' ? t('projects.running') : t('projects.developing')}</span></td>
                  <td style={{ padding: '14px 20px' }}><button onClick={() => handleDelete(p.id)} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Trash2 style={{ width: 14, height: 14 }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', opacity: page === 1 ? 0.3 : 1 }}>
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{page} / {Math.ceil(filtered.length / PAGE_SIZE)}</span>
            <button onClick={() => setPage(Math.min(Math.ceil(filtered.length / PAGE_SIZE), page + 1))} disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', opacity: page >= Math.ceil(filtered.length / PAGE_SIZE) ? 0.3 : 1 }}>
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
