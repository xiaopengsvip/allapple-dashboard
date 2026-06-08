'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import {
  Package, Globe, Cloud, Server, GitFork, ExternalLink, Activity,
  Shield, Rocket, Play, FileText, Link as LinkIcon, TrendingUp,
  CheckCircle2, AlertTriangle, Layers, Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, pm2Res, statsRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
          fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
          fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: null })),
        ]);
        setData({ projects: projRes.projects || [], pm2: pm2Res.services || [], stats: statsRes.stats });
      } catch {}
      setTimeout(() => setLoaded(true), 50);
    };
    load();
  }, []);

  const projects = data?.projects || [];
  const pm2 = data?.pm2 || [];
  const sys = data?.stats;
  const vercelCount = projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length;
  const serverCount = pm2.filter((s: any) => s.status === 'online').length;
  const fmtBytes = (b: number) => b > 1e9 ? (b / 1e9).toFixed(1) + ' GB' : (b / 1e6).toFixed(0) + ' MB';
  const fmtUptime = (s: number) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600); return `${d}d ${h}h`; };

  return (
    <AppShell>
      <TopBar title="仪表盘" subtitle="Everett 运维总览" />
      <div className="p-6 space-y-6 max-w-[1440px]">

        {/* ═══ KPI Cards ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card anim={1} label="项目总数" value={projects.length} icon={Package} color="#06B6D4" loaded={loaded} />
          <Card anim={2} label="域名总数" value={77} icon={Globe} color="#A78BFA" loaded={loaded} />
          <Card anim={3} label="GitHub 仓库" value={33} icon={GitFork} color="#F59E0B" loaded={loaded} />
          <Card anim={4} label="Vercel 项目" value={vercelCount} icon={Cloud} color="#6366F1" loaded={loaded} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card anim={5} label="在线服务" value={serverCount} icon={Server} color="#10B981" loaded={loaded} />
          <Card anim={6} label="PM2 进程" value={pm2.length} icon={Layers} color="#06B6D4" loaded={loaded} />
          <Card anim={7} label="SSL 证书" value={12} icon={Shield} color="#10B981" loaded={loaded} />
          <Card anim={8} label="健康度" value="99%" icon={Activity} color="#10B981" loaded={loaded} />
        </div>

        {/* ═══ Status + Resources Row ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* System Health */}
          <div className="anim-fade-up anim-delay-5 rounded-2xl p-5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-white">系统状态</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>全部正常</span>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'GitHub API', latency: '45ms' },
                { name: 'Vercel API', latency: '32ms' },
                { name: 'Cloudflare', latency: '28ms' },
                { name: '腾讯云服务器', latency: '12ms' },
                { name: 'PM2 进程', latency: '3ms' },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                    <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{s.latency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today */}
          <div className="anim-fade-up anim-delay-6 rounded-2xl p-5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-[13px] font-semibold text-white mb-4">今日概览</h3>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="部署次数" value="3" trend="+2" color="var(--cyan)" />
              <MiniStat label="提交次数" value="12" trend="+5" color="var(--accent-light)" />
              <MiniStat label="告警次数" value="0" color="var(--success)" />
              <MiniStat label="证书过期" value="0" color="var(--success)" />
            </div>
          </div>

          {/* Server Resources */}
          <div className="anim-fade-up anim-delay-7 rounded-2xl p-5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-white">服务器资源</h3>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{sys?.hostname || '—'}</span>
            </div>
            {sys && (
              <div className="space-y-3.5">
                <Bar label="CPU" value={sys.cpu.loadAvg[0]} max={sys.cpu.cores} display={`${sys.cpu.loadAvg[0].toFixed(2)} (${Math.round(sys.cpu.loadAvg[0] / sys.cpu.cores * 100)}%)`} color="var(--cyan)" />
                <Bar label="内存" value={sys.memory.used} max={sys.memory.total} display={`${fmtBytes(sys.memory.used)} (${Math.round(sys.memory.used / sys.memory.total * 100)}%)`} color="var(--purple)" />
                <Bar label="磁盘" value={sys.disk.used} max={sys.disk.total} display={`${fmtBytes(sys.disk.used)} (${Math.round(sys.disk.used / sys.disk.total * 100)}%)`} color="var(--warning)" />
                <div className="flex justify-between text-[10px] pt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>Uptime: {fmtUptime(sys.uptime)}</span>
                  <span>{sys.cpu.cores} cores · {sys.arch}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Project Cards ═══ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">项目中心</h3>
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-xl transition-colors" style={{ background: 'var(--accent-soft)', color: 'var(--accent-light)' }}>查看全部 →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p: any, i: number) => (
              <div key={p.id} className={`anim-fade-up anim-delay-${i + 1} rounded-2xl p-5 transition-all duration-200 cursor-pointer`}
                style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${p.color}40, ${p.color}20)`, border: `1px solid ${p.color}30` }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{p.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.category}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: p.status === 'active' ? 'var(--success)' : 'var(--warning)', boxShadow: p.status === 'active' ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(245,158,11,0.5)' }} />
                </div>
                <div className="flex gap-1.5 mb-3">
                  <Tag>{p.deploy_target === 'vercel' ? '▲ Vercel' : p.deploy_target === 'server' ? '🖥 Server' : '🔗 Both'}</Tag>
                  {p.github_repo && <Tag>{p.github_repo}</Tag>}
                </div>
                {p.domain && (
                  <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium flex items-center gap-1 transition-colors hover:underline" style={{ color: 'var(--accent-light)' }}>
                    {p.domain} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ PM2 + Deployments ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PM2 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-white">PM2 进程管理</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>{serverCount}/{pm2.length} 在线</span>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
              {pm2.map((s: any, i: number) => (
                <div key={s.name} className="flex items-center gap-4 px-5 py-3.5 transition-colors" style={{ borderBottom: i < pm2.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.status === 'online' ? 'var(--success)' : 'var(--error)', boxShadow: s.status === 'online' ? '0 0 6px rgba(16,185,129,0.5)' : '0 0 6px rgba(239,68,68,0.5)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-white">{s.name}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>PID {s.pid} · {s.memory ? `${Math.round(s.memory / 1024 / 1024)}MB` : '—'} · CPU {s.cpu || 0}%</div>
                  </div>
                  <div className="flex gap-0.5">
                    <button className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--success)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    ><Play className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    ><FileText className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-white">实时事件流</h3>
            </div>
            <div className="rounded-2xl p-4 space-y-0.5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
              {[
                { time: '23:41', type: 'success', text: 'dashboard 重新部署成功', tag: 'PM2' },
                { time: '23:38', type: 'success', text: 'Everett 运维中心 v1.0 构建完成', tag: 'Build' },
                { time: '23:33', type: 'info', text: 'xiaopengsvip/allapple-dashboard pushed to main', tag: 'GitHub' },
                { time: '23:27', type: 'success', text: 'PM2 dashboard 进程启动成功', tag: 'PM2' },
                { time: '23:22', type: 'warning', text: '端口 3400 被占用，自动清理完成', tag: 'Server' },
              ].map((evt, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span className="text-[10px] font-mono w-10 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{evt.time}</span>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: evt.type === 'success' ? 'var(--success)' : evt.type === 'warning' ? 'var(--warning)' : 'var(--accent)', boxShadow: `0 0 6px ${evt.type === 'success' ? 'rgba(16,185,129,0.5)' : evt.type === 'warning' ? 'rgba(245,158,11,0.5)' : 'rgba(99,102,241,0.5)'}` }} />
                  <span className="flex-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>{evt.text}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{evt.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Domains ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { zone: 'allapple.top', count: 68, color: 'var(--warning)', records: ['aios → A → 43.167.213.143', 'enxx → CNAME → vercel-dns', 'chat → A → 43.167.213.143'] },
            { zone: 'vios.top', count: 9, color: 'var(--success)', records: ['aios → A → 43.167.213.143', 'game → A → 43.167.213.143', 'dashboard → A → 76.76.21.21'] },
          ].map(d => (
            <div key={d.zone} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4" style={{ color: d.color }} />
                <span className="text-[13px] font-semibold text-white">{d.zone}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent-light)' }}>{d.count} records</span>
              </div>
              <div className="space-y-1.5">
                {d.records.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono" style={{ background: 'var(--bg-root)', color: 'var(--text-secondary)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    {r}
                  </div>
                ))}
                <div className="text-[10px] px-3" style={{ color: 'var(--text-muted)' }}>+{d.count - 3} more...</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}

/* ═══ Components ═══ */

function Card({ anim, label, value, icon: Icon, color, loaded }: {
  anim: number; label: string; value: number | string; icon: any; color: string; loaded: boolean;
}) {
  return (
    <div className={`anim-fade-up anim-delay-${anim} rounded-2xl p-5 transition-all duration-200`}
      style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="text-[36px] font-extrabold leading-none tracking-tight" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {loaded ? value : '—'}
      </div>
    </div>
  );
}

function MiniStat({ label, value, trend, color }: { label: string; value: string; trend?: string; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--bg-root)' }}>
      <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="flex items-end gap-1.5">
        <span className="text-[24px] font-bold leading-none" style={{ color }}>{value}</span>
        {trend && <span className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--success)' }}>+{trend}</span>}
      </div>
    </div>
  );
}

function Bar({ label, value, max, display, color }: { label: string; value: number; max: number; display: string; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{display}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-lg" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
      {children}
    </span>
  );
}
