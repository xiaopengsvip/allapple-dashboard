'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitFork, ExternalLink, Star, Lock, Globe, RefreshCw, Search } from 'lucide-react';

export default function GitHubPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/repos');
      const data = await res.json();
      setRepos(data.repos || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <TopBar title="GitHub 仓库" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-sm text-[#71717a]">{repos.length} 仓库</div>
          <div className="relative sm:ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
            <input type="text" placeholder="搜索仓库..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#12121a] border border-[#1e1e2e] text-[#e4e4e7] w-48" />
          </div>
          <button onClick={fetchRepos} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 hover:border-[#71717a] transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#71717a]" />
                  <span className="text-sm font-medium">{r.name}</span>
                  {r.private ? <Lock className="w-3 h-3 text-[#fb923c]" /> : <Globe className="w-3 h-3 text-[#34d399]" />}
                </div>
                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="text-[#71717a] hover:text-[#06d6a0]"><ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
              {r.description && <p className="text-[11px] text-[#71717a] mb-2 line-clamp-2">{r.description}</p>}
              <div className="flex items-center gap-3 text-[10px] text-[#71717a]">
                {r.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06d6a0]" />{r.language}</span>}
                <span className="flex items-center gap-1"><Star className="w-3 h-3" />{r.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{r.forks_count}</span>
                <span>{new Date(r.updated_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-xs text-[#71717a] py-8">{loading ? '加载中...' : '暂无数据，请在设置中配置 GitHub Token'}</div>}
        </div>
      </div>
    </AppShell>
  );
}
