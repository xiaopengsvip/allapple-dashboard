'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import PlatformBadge from '@/components/PlatformBadge';
import { Package, Globe, Cloud, Server, GitFork, ExternalLink, Play, FileText, Link as LinkIcon } from 'lucide-react';

interface DashboardData {
  projects: any[];
  pm2: any[];
  stats: {
    totalProjects: number;
    totalDomains: number;
    vercelCount: number;
    serverCount: number;
    githubCount: number;
    publicRepos: number;
    privateRepos: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, pm2Res] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
          fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
        ]);
        const projects = projRes.projects || [];
        const pm2 = pm2Res.services || [];
        setData({
          projects,
          pm2,
          stats: {
            totalProjects: projects.length,
            totalDomains: 77,
            vercelCount: projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length,
            serverCount: pm2.filter((s: any) => s.status === 'online').length,
            githubCount: 33,
            publicRepos: 31,
            privateRepos: 2,
          },
        });
      } catch {}
    };
    fetchData();
  }, []);

  const s = data?.stats;
  const projects = data?.projects || [];
  const pm2 = data?.pm2 || [];

  return (
    <AppShell>
      <TopBar title="仪表盘" />
      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard icon={Package} label="总项目" value={s?.totalProjects ?? '—'} sub="全部平台" color="#3b82f6" />
          <StatsCard icon={Globe} label="域名总数" value={s?.totalDomains ?? '—'} sub="2 个域名体系" color="#8b5cf6" />
          <StatsCard icon={Cloud} label="Vercel" value={s?.vercelCount ?? '—'} sub="Edge Network" color="#a1a1aa" />
          <StatsCard icon={Server} label="服务器" value={s?.serverCount ?? '—'} sub="PM2 在线" color="#22c55e" />
          <StatsCard icon={GitFork} label="GitHub" value={s?.githubCount ?? '—'} sub={`${s?.publicRepos ?? 0} public + ${s?.privateRepos ?? 0} private`} color="#a78bfa" />
        </div>

        {/* Relationship Map */}
        <Section title="项目关联全景图">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RelationCard title="GitHub" subtitle={`${projects.filter(p => p.github_repo).length} 仓库 · xiaopengsvip`} items={
              projects.filter(p => p.github_repo).slice(0, 5).map(p => ({
                name: p.github_repo, tag: p.domain, dotColor: '#22c55e'
              }))
            } more={Math.max(0, projects.filter(p => p.github_repo).length - 5)} />
            <RelationCard title="部署平台" subtitle={`3 平台 · ${projects.length} 项目`} items={[
              { name: '▲ Vercel Edge', tag: `${s?.vercelCount ?? 0} 项目`, dotColor: '#a1a1aa' },
              { name: '🖥️ 腾讯云 Tokyo', tag: `PM2×${s?.serverCount ?? 0}`, dotColor: '#3b82f6' },
              { name: '☁️ AWS Frankfurt', tag: 'ly-logistics', dotColor: '#f59e0b' },
              { name: '🔗 双部署', tag: 'ENXX+DPS', dotColor: '#8b5cf6' },
            ]} />
            <RelationCard title="Cloudflare DNS" subtitle="2 Zones · 77 records" items={[
              { name: 'allapple.top', tag: '68 records', dotColor: '#f59e0b' },
              { name: 'vios.top', tag: '9 records', dotColor: '#22c55e' },
              { name: '→ Vercel CNAME', tag: '20+', dotColor: '#3b82f6' },
              { name: '→ 服务器 A Record', tag: '12+', dotColor: '#8b5cf6' },
            ]} />
          </div>
        </Section>

        {/* Projects Table */}
        <Section title="项目管理" action={<button className="px-3.5 py-1.5 rounded-lg text-[13px] bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb] transition-colors">+ 新建项目</button>}>
          <div className="bg-[#18181b] border border-[#ffffff08] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#ffffff08]">
                  <th className="text-left px-5 py-3 text-[12px] text-[#52525b] font-medium">项目名称</th>
                  <th className="text-left px-5 py-3 text-[12px] text-[#52525b] font-medium">部署平台</th>
                  <th className="text-left px-5 py-3 text-[12px] text-[#52525b] font-medium">域名</th>
                  <th className="text-left px-5 py-3 text-[12px] text-[#52525b] font-medium">GitHub</th>
                  <th className="text-left px-5 py-3 text-[12px] text-[#52525b] font-medium">状态</th>
                  <th className="text-right px-5 py-3 text-[12px] text-[#52525b] font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 10).map((p: any, i: number) => (
                  <tr key={p.id} className={`border-b border-[#ffffff06] hover:bg-[#ffffff04] transition-colors ${i === projects.slice(0, 10).length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color || '#3b82f6' }} />
                        <span className="text-[13px] font-medium text-[#e4e4e7]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><PlatformBadge target={p.deploy_target} /></td>
                    <td className="px-5 py-3.5">
                      {p.domain ? (
                        <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] text-[#3b82f6] hover:underline">{p.domain}</a>
                      ) : <span className="text-[12px] text-[#3f3f46]">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {p.github_repo ? (
                        <a href={`https://github.com/xiaopengsvip/${p.github_repo}`} target="_blank" rel="noopener noreferrer"
                          className="text-[12px] text-[#71717a] hover:text-[#d4d4d8]">{p.github_repo}</a>
                      ) : <span className="text-[12px] text-[#3f3f46]">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex gap-1 justify-end">
                        {p.domain && <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-[#ffffff08] text-[#3f3f46] hover:text-[#71717a] transition-colors"><LinkIcon className="w-3.5 h-3.5" /></a>}
                        <button className="p-1.5 rounded-md hover:bg-[#ffffff08] text-[#3f3f46] hover:text-[#71717a] transition-colors">⚙</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Server Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Section title="腾讯云 Tokyo · PM2">
            <div className="bg-[#18181b] border border-[#ffffff08] rounded-xl p-4 space-y-2">
              {pm2.map((s: any) => (
                <div key={s.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ffffff04] transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'online' ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
                    style={s.status === 'online' ? { boxShadow: '0 0 8px rgba(34,197,94,0.4)' } : {}} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#e4e4e7]">{s.name}</div>
                    <div className="text-[11px] text-[#52525b] mt-0.5">
                      PID {s.pid} · {s.memory ? `${Math.round(s.memory / 1024 / 1024)}MB` : '?'} · CPU {s.cpu || 0}%
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <button className="p-1.5 rounded-md hover:bg-[#ffffff08] text-[#3f3f46] hover:text-[#22c55e] transition-colors"><Play className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-md hover:bg-[#ffffff08] text-[#3f3f46] hover:text-[#71717a] transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {pm2.length === 0 && <div className="text-[12px] text-[#3f3f46] text-center py-6">暂无 PM2 数据</div>}
            </div>
          </Section>
          <Section title="Vercel · 最近部署">
            <div className="bg-[#18181b] border border-[#ffffff08] rounded-xl p-4 space-y-2">
              {projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ffffff04] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#e4e4e7]">{p.name}</div>
                    <div className="text-[11px] text-[#52525b] mt-0.5">{p.domain}</div>
                  </div>
                  <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-[#ffffff08] text-[#3f3f46] hover:text-[#71717a] transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

/* Shared Components */
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[#e4e4e7]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function RelationCard({ title, subtitle, items, more }: {
  title: string; subtitle: string;
  items: { name: string; tag?: string; dotColor: string }[];
  more?: number;
}) {
  return (
    <div className="bg-[#18181b] border border-[#ffffff08] rounded-xl p-4">
      <div className="text-[13px] font-semibold text-[#e4e4e7] mb-1">{title}</div>
      <div className="text-[11px] text-[#52525b] mb-3">{subtitle}</div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#09090b] text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dotColor }} />
            <span className="flex-1 text-[#d4d4d8] truncate">{item.name}</span>
            {item.tag && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffffff06] text-[#71717a] flex-shrink-0">{item.tag}</span>}
          </div>
        ))}
        {more !== undefined && more > 0 && (
          <div className="text-[11px] text-[#3f3f46] px-3">+{more} 更多...</div>
        )}
      </div>
    </div>
  );
}
