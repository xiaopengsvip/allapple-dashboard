'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', transition: `box-shadow 250ms ${EASE}, border-color 250ms ${EASE}`, ...style }}>{children}</div>;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('全部');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', category: '工具', deploy_target: 'vercel', domain: '', github_repo: '', color: '#4D7FFF', description: '' });

  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);

  const categories = ['全部', '品牌官网', '工作台', 'AI应用', '数据可视化', '工具', '媒体', '教育'];
  const filtered = projects.filter(p => {
    if (filter !== '全部' && p.category !== filter) return false;
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
    if (!confirm('确定删除?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <AppShell>
      <TopBar title="项目中心" subtitle="统一管理所有项目" />
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: filter === c ? 'var(--accent-soft)' : 'var(--bg-card)',
                color: filter === c ? 'var(--accent)' : 'var(--text-muted)',
                border: `1px solid ${filter === c ? 'rgba(77,127,255,0.2)' : 'var(--border)'}`,
                transition: `all 150ms ${EASE}`,
              }}>{c} ({c === '全部' ? projects.length : projects.filter(p => p.category === c).length})</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', '全部'], ['vercel', '▲ Vercel'], ['server', '🖥 服务器'], ['both', '🔗 双部署']].map(([k, v]) => (
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
            <input type="text" placeholder="搜索项目..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 12, width: 160, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <Plus style={{ width: 14, height: 14 }} /> 新建项目
          </button>
        </div>

        {/* New Project Modal */}
        {showNew && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowNew(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
            <div style={{ position: 'relative', background: 'var(--bg-surface)', borderRadius: 20, padding: 32, width: 440, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>新建项目</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input placeholder="项目名称" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input placeholder="描述" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                    {categories.filter(c => c !== '全部').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={newProject.deploy_target} onChange={e => setNewProject({...newProject, deploy_target: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                    <option value="vercel">Vercel</option><option value="server">服务器</option><option value="both">双部署</option>
                  </select>
                </div>
                <input placeholder="域名" value={newProject.domain} onChange={e => setNewProject({...newProject, domain: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input placeholder="GitHub 仓库名" value={newProject.github_repo} onChange={e => setNewProject({...newProject, github_repo: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>取消</button>
                  <button onClick={handleCreate} disabled={!newProject.name} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', opacity: newProject.name ? 1 : 0.4 }}>创建</button>
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
                {['项目名称', '分类', '部署平台', '域名', 'GitHub', '状态', '操作'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '14px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || '#4D7FFF', flexShrink: 0 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span></div></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: `${p.color}12`, color: `${p.color}cc` }}>{p.category}</span></td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.deploy_target === 'vercel' ? '▲ Vercel' : p.deploy_target === 'server' ? '🖥 Server' : '🔗 Both'}</td>
                  <td style={{ padding: '14px 20px' }}>{p.domain ? <a href={`https://${p.domain}`} target="_blank" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>{p.domain}</a> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '14px 20px' }}>{p.github_repo ? <a href={`https://github.com/xiaopengsvip/${p.github_repo}`} target="_blank" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>{p.github_repo}</a> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ padding: '14px 20px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: p.status === 'active' ? 'var(--success)' : 'var(--warning)' }} />{p.status === 'active' ? '运行中' : '开发中'}</span></td>
                  <td style={{ padding: '14px 20px' }}><button onClick={() => handleDelete(p.id)} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Trash2 style={{ width: 14, height: 14 }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
