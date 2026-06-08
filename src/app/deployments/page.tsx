'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import StatusBadge from '@/components/StatusBadge';
import { Rocket, RefreshCw, ExternalLink, Clock } from 'lucide-react';

export default function DeploymentsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <AppShell>
      <TopBar title="部署管理" titleEn="Deployments" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm text-[#71717a]">所有项目的部署状态</div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vercel Deployments */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">▲ Vercel 部署</h3>
            <div className="space-y-2">
              {projects.filter(p => p.deploy_target === 'vercel' || p.deploy_target === 'both').map(p => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0f]">
                  <div className="w-2 h-2 rounded-full bg-[#34d399]" style={{ boxShadow: '0 0 6px #34d399' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-[#71717a]">{p.domain}</div>
                  </div>
                  <StatusBadge status={p.status} />
                  {p.domain && <a href={`https://${p.domain}`} target="_blank" className="text-[#71717a] hover:text-[#06d6a0]"><ExternalLink className="w-3 h-3" /></a>}
                </div>
              ))}
            </div>
          </div>

          {/* Server Deployments */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">🖥️ 服务器部署 (PM2)</h3>
            <div className="space-y-2">
              {projects.filter(p => p.deploy_target === 'server' || p.deploy_target === 'both').map(p => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0f]">
                  <div className="w-2 h-2 rounded-full bg-[#60a5fa]" style={{ boxShadow: '0 0 6px #60a5fa' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-[#71717a]">{p.pm2_name} :{p.server_port}</div>
                  </div>
                  <StatusBadge status={p.status} />
                  {p.domain && <a href={`https://${p.domain}`} target="_blank" className="text-[#71717a] hover:text-[#06d6a0]"><ExternalLink className="w-3 h-3" /></a>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
