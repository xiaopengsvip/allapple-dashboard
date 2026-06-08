'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import PlatformBadge from '@/components/PlatformBadge';
import { Package, Globe, Cloud, Server, GitFork, RefreshCw, ExternalLink, Play, FileText, Link as LinkIcon } from 'lucide-react';

interface DashboardData {
  projects: any[];
  pm2: any[];
  vercelDeployments: any[];
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
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, pm2Res, statsRes] = await Promise.all([
        fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
        fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
        fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: {} })),
      ]);

      const projects = projRes.projects || [];
      const pm2 = pm2Res.services || [];
      const vercelCount = projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length;
      const serverCount = pm2.filter((s: any) => s.pm2_env?.status === 'online').length;

      setData({
        projects,
        pm2,
        vercelDeployments: [],
        stats: {
          totalProjects: projects.length,
          totalDomains: 77,
          vercelCount,
          serverCount,
          githubCount: 33,
          publicRepos: 31,
          privateRepos: 2,
        },
      });
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const s = data?.stats;

  return (
    <AppShell>
      <TopBar title="仪表盘" titleEn="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatsCard icon={Package} label="总项目" value={s?.totalProjects ?? '...'} sub="全部平台" color="#06d6a0" />
          <StatsCard icon={Globe} label="域名总数" value={s?.totalDomains ?? '...'} sub="2 个域名体系" color="#a78bfa" />
          <StatsCard icon={Cloud} label="Vercel" value={s?.vercelCount ?? '...'} sub="Edge Network" color="#ffffff" />
          <StatsCard icon={Server} label="服务器服务" value={s?.serverCount ?? '...'} sub="PM2 在线" color="#60a5fa" />
          <StatsCard icon={GitFork} label="GitHub" value={s?.githubCount ?? '...'} sub={`${s?.publicRepos ?? 0} public + ${s?.privateRepos ?? 0} private`} color="#a78bfa" />
        </div>

        {/* Relationship Map */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06d6a0]" />
              <span className="text-sm font-semibold">项目关联全景图</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#71717a] hover:text-[#e4e4e7] border border-[#1e1e2e] hover:border-[#71717a] transition-all">
              <FileText className="w-3 h-3" /> 完整视图
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GitHub */}
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4">
              <div className="text-sm font-semibold mb-1">⚡ GitHub</div>
              <div className="text-[11px] text-[#71717a] mb-3">33 仓库 · xiaopengsvip</div>
              <div className="space-y-1.5">
                {(data?.projects || []).filter((p: any) => p.github_repo).slice(0, 6).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] flex-shrink-0" />
                    <span className="flex-1 truncate text-[#e4e4e7]">{p.github_repo}</span>
                    {p.domain && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">{p.domain}</span>}
                  </div>
                ))}
                <div className="text-[10px] text-[#71717a] px-2">+{Math.max(0, (data?.projects || []).filter((p: any) => p.github_repo).length - 6)} 更多...</div>
              </div>
            </div>
            {/* Deploy Platforms */}
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4">
              <div className="text-sm font-semibold mb-1">🚀 部署平台</div>
              <div className="text-[11px] text-[#71717a] mb-3">3 platforms · {s?.totalProjects ?? 0} projects</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                  <span className="flex-1 text-[#e4e4e7]">▲ Vercel Edge</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a78bfa20] text-[#a78bfa]">{s?.vercelCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                  <span className="flex-1 text-[#e4e4e7]">🖥️ 腾讯云 Tokyo</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">PM2×{s?.serverCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
                  <span className="flex-1 text-[#e4e4e7]">☁️ AWS Frankfurt</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">ly-logistics</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  <span className="flex-1 text-[#e4e4e7]">🔗 双部署</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a78bfa20] text-[#a78bfa]">ENXX+DPS</span>
                </div>
              </div>
            </div>
            {/* Cloudflare DNS */}
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4">
              <div className="text-sm font-semibold mb-1">🌐 Cloudflare DNS</div>
              <div className="text-[11px] text-[#71717a] mb-3">2 Zones · 77 records</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
                  <span className="flex-1 text-[#e4e4e7]">allapple.top</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">68 records</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  <span className="flex-1 text-[#e4e4e7]">vios.top</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">9 records</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                  <span className="flex-1 text-[#e4e4e7]">→ Vercel CNAME</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">20+</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#12121a] text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
                  <span className="flex-1 text-[#e4e4e7]">→ 服务器 A Record</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0]">12+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1e1e2e]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06d6a0]" />
              <span className="text-sm font-semibold">项目管理</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#71717a] border border-[#1e1e2e] hover:border-[#71717a] transition-all">
                🔍 筛选
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-black bg-[#06d6a0] hover:bg-[#05c490] font-medium transition-all">
                + 新建项目
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">项目名称</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">部署平台</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">域名</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">GitHub</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">状态</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {(data?.projects || []).slice(0, 10).map((p: any) => (
                <tr key={p.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a25] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.color || '#06d6a0' }} />
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PlatformBadge target={p.deploy_target} /></td>
                  <td className="px-4 py-3">
                    {p.domain && (
                      <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#06d6a0] hover:underline">{p.domain}</a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.github_repo ? (
                      <a href={`https://github.com/xiaopengsvip/${p.github_repo}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#71717a] hover:text-[#e4e4e7]">{p.github_repo}</a>
                    ) : <span className="text-xs text-[#71717a]">—</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.domain && <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#06d6a0] transition-all"><LinkIcon className="w-3.5 h-3.5" /></a>}
                      {p.deploy_target === 'server' || p.deploy_target === 'both' ? (
                        <button className="p-1.5 rounded-md hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#60a5fa] transition-all" title="服务器"><Server className="w-3.5 h-3.5" /></button>
                      ) : (
                        <button className="p-1.5 rounded-md hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#ffffff] transition-all" title="Vercel"><Cloud className="w-3.5 h-3.5" /></button>
                      )}
                      <button className="p-1.5 rounded-md hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7] transition-all" title="设置">⚙</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Server Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PM2 */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">🖥️ 腾讯云 Tokyo · PM2</span>
                <span className="text-[11px] text-[#34d399]">● 全部在线</span>
              </div>
              <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#71717a] hover:text-[#e4e4e7] border border-[#1e1e2e] transition-all">
                <FileText className="w-3 h-3" /> 完整日志
              </button>
            </div>
            <div className="space-y-2">
              {(data?.pm2 || []).map((s: any) => (
                <div key={s.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0f]">
                  <div className={`w-2 h-2 rounded-full ${s.pm2_env?.status === 'online' ? 'bg-[#34d399]' : 'bg-[#f87171]'}`}
                    style={s.pm2_env?.status === 'online' ? { boxShadow: '0 0 6px #34d399' } : {}} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{s.name}</div>
                    <div className="text-[10px] text-[#71717a]">
                      {s.monit ? `${Math.round((s.monit.memory || 0) / 1024 / 1024)}MB` : ''} ·
                      PID {s.pid || '—'} ·
                      {s.pm2_env?.pm_uptime ? `${Math.round((Date.now() - s.pm2_env.pm_uptime) / 3600000)}h` : ''}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#34d399]"><Play className="w-3 h-3" /></button>
                    <button className="p-1 rounded hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]"><FileText className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
              {(!data?.pm2 || data.pm2.length === 0) && (
                <div className="text-xs text-[#71717a] text-center py-4">暂无 PM2 数据</div>
              )}
            </div>
          </div>

          {/* Vercel */}
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">▲ Vercel Edge · 最近部署</span>
                <span className="text-[11px] text-[#71717a]">{s?.vercelCount ?? 0} 项目</span>
              </div>
            </div>
            <div className="space-y-2">
              {(data?.projects || []).filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0a0a0f]">
                  <div className="w-2 h-2 rounded-full bg-[#34d399]" style={{ boxShadow: '0 0 6px #34d399' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-[#71717a]">{p.domain}</div>
                  </div>
                  <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#06d6a0]">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
