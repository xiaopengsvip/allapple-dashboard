'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitBranch, GitFork, Cloud, Server, Globe } from 'lucide-react';

export default function RelationsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);

  const vercelProjects = projects.filter(p => p.deploy_target === 'vercel' || p.deploy_target === 'both');
  const serverProjects = projects.filter(p => p.deploy_target === 'server' || p.deploy_target === 'both');
  const githubProjects = projects.filter(p => p.github_repo);

  return (
    <AppShell>
      <TopBar title="关联视图" titleEn="Relations" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GitHub */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitFork className="w-5 h-5 text-[#e4e4e7]" />
              <span className="font-semibold">GitHub</span>
              <span className="text-[11px] text-[#71717a]">{githubProjects.length} 仓库</span>
            </div>
            <div className="space-y-1.5">
              {githubProjects.map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0f] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  <span className="flex-1 truncate">{p.github_repo}</span>
                  {p.domain && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0] truncate max-w-[120px]">{p.domain}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Deploy Platforms */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-[#a78bfa]" />
              <span className="font-semibold">部署平台</span>
            </div>
            <div className="space-y-3">
              <div className="bg-[#0a0a0f] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2"><span className="text-xs font-medium">▲ Vercel</span><span className="text-[10px] text-[#71717a]">{vercelProjects.length}</span></div>
                {vercelProjects.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-2 px-2 py-1 text-[11px]"><span className="w-1 h-1 rounded-full bg-[#a78bfa]" /><span className="truncate">{p.name}</span></div>
                ))}
              </div>
              <div className="bg-[#0a0a0f] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2"><span className="text-xs font-medium">🖥️ 腾讯云 Tokyo</span><span className="text-[10px] text-[#71717a]">{serverProjects.length}</span></div>
                {serverProjects.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-2 px-2 py-1 text-[11px]"><span className="w-1 h-1 rounded-full bg-[#60a5fa]" /><span className="truncate">{p.name}</span>{p.pm2_name && <span className="text-[10px] text-[#71717a]">:{p.server_port}</span>}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Domains */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#fb923c]" />
              <span className="font-semibold">域名映射</span>
            </div>
            <div className="space-y-1.5">
              {projects.filter(p => p.domain).map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0f] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
                  <span className="flex-1 font-mono truncate">{p.domain}</span>
                  <span className="text-[10px] text-[#71717a] truncate max-w-[80px]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
