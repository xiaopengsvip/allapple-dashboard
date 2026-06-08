'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Cloud, ExternalLink, RefreshCw, Search, Clock } from 'lucide-react';

export default function VercelPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vercel/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <TopBar title="Vercel 项目" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-sm text-[#71717a]">{projects.length} 项目</div>
          <div className="relative sm:ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
            <input type="text" placeholder="搜索..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#12121a] border border-[#1e1e2e] text-[#e4e4e7] w-48" />
          </div>
          <button onClick={fetchProjects} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">项目</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">域名</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">Framework</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">最近更新</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">链接</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a25]">
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-[#06d6a0]">{p.targets?.production?.alias?.[0] || p.name + '.vercel.app'}</td>
                  <td className="px-4 py-3 text-xs text-[#71717a]">{p.framework || '—'}</td>
                  <td className="px-4 py-3 text-xs text-[#71717a]"><Clock className="w-3 h-3 inline mr-1" />{p.updated_at ? new Date(p.updated_at).toLocaleDateString('zh-CN') : '—'}</td>
                  <td className="px-4 py-3"><a href={`https://${p.name}.vercel.app`} target="_blank" className="text-[#71717a] hover:text-[#06d6a0]"><ExternalLink className="w-3.5 h-3.5" /></a></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-[#71717a]">{loading ? '加载中...' : '暂无数据，请在设置中配置 Vercel Token'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
