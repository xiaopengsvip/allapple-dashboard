'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import StatusBadge from '@/components/StatusBadge';
import PlatformBadge from '@/components/PlatformBadge';
import { Plus, Search, ExternalLink, GitFork, Server, Cloud, Link as LinkIcon, Trash2, Edit } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('全部');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', category: '工具', deploy_target: 'vercel', domain: '', github_repo: '', color: '#06d6a0', description: '' });

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || []));
  }, []);

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
    if (d.project) { setProjects([d.project, ...projects]); setShowNew(false); setNewProject({ name: '', category: '工具', deploy_target: 'vercel', domain: '', github_repo: '', color: '#06d6a0', description: '' }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <AppShell>
      <TopBar title="项目管理" />
      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === c ? 'bg-[#06d6a020] border border-[#06d6a040] text-[#06d6a0]' : 'bg-[#12121a] border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]'}`}>{c} ({c === '全部' ? projects.length : projects.filter(p => p.category === c).length})</button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="flex gap-1">
              {[['all', '全部'], ['vercel', '▲ Vercel'], ['server', '🖥️ 服务器'], ['both', '🔗 双部署']].map(([k, v]) => (
                <button key={k} onClick={() => setPlatformFilter(k)} className={`px-2 py-1 rounded-md text-[11px] transition-all ${platformFilter === k ? 'bg-[#06d6a020] text-[#06d6a0]' : 'text-[#71717a] hover:text-[#e4e4e7]'}`}>{v}</button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
              <input type="text" placeholder="搜索项目..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#12121a] border border-[#1e1e2e] text-[#e4e4e7] placeholder:text-[#71717a] w-40" />
            </div>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[#06d6a0] text-black font-medium hover:bg-[#05c490]"><Plus className="w-3 h-3" /> 新建项目</button>
          </div>
        </div>

        {/* New Project Modal */}
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNew(false)}>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">新建项目</h3>
              <div className="space-y-3">
                <input placeholder="项目名称" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm" />
                <input placeholder="描述" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm">
                    {categories.filter(c => c !== '全部').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={newProject.deploy_target} onChange={e => setNewProject({...newProject, deploy_target: e.target.value})} className="px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm">
                    <option value="vercel">Vercel</option>
                    <option value="server">服务器</option>
                    <option value="both">双部署</option>
                  </select>
                </div>
                <input placeholder="域名 (如 app.allapple.top)" value={newProject.domain} onChange={e => setNewProject({...newProject, domain: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm" />
                <input placeholder="GitHub 仓库名" value={newProject.github_repo} onChange={e => setNewProject({...newProject, github_repo: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm" />
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg text-sm border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">取消</button>
                  <button onClick={handleCreate} disabled={!newProject.name} className="px-4 py-2 rounded-lg text-sm bg-[#06d6a0] text-black font-medium disabled:opacity-50">创建</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">项目名称</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">分类</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">部署平台</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">域名</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">GitHub</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">状态</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a25] transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-sm font-medium">{p.name}</span></div></td>
                  <td className="px-4 py-3"><span className="text-[11px] px-2 py-0.5 rounded" style={{ background: `${p.color}10`, color: `${p.color}cc` }}>{p.category}</span></td>
                  <td className="px-4 py-3"><PlatformBadge target={p.deploy_target} /></td>
                  <td className="px-4 py-3">{p.domain && <a href={`https://${p.domain}`} target="_blank" className="text-xs text-[#06d6a0] hover:underline">{p.domain}</a>}</td>
                  <td className="px-4 py-3">{p.github_repo ? <a href={`https://github.com/xiaopengsvip/${p.github_repo}`} target="_blank" className="text-xs text-[#71717a] hover:text-[#e4e4e7]">{p.github_repo}</a> : <span className="text-xs text-[#71717a]">—</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#f87171]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
