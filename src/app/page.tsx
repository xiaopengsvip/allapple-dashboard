'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import {
  Package, Globe, Cloud, Server, GitFork, ExternalLink, Activity,
  Shield, Rocket, Clock, Cpu, HardDrive, MemoryStick, Play, FileText,
  Link as LinkIcon, TrendingUp, AlertTriangle, CheckCircle2, Zap,
  ArrowUpRight, ArrowDownRight, Layers, Database, Network
} from 'lucide-react';

interface DashData {
  projects: any[];
  pm2: any[];
  stats: any;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
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
      setTimeout(() => setLoaded(true), 100);
    };
    load();
  }, []);

  const projects = data?.projects || [];
  const pm2 = data?.pm2 || [];
  const sysStats = data?.stats;
  const vercelCount = projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length;
  const serverCount = pm2.filter((s: any) => s.status === 'online').length;

  const fmtBytes = (b: number) => b > 1e9 ? (b / 1e9).toFixed(1) + ' GB' : b > 1e6 ? (b / 1e6).toFixed(0) + ' MB' : (b / 1e3).toFixed(0) + ' KB';
  const fmtUptime = (s: number) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600); return d > 0 ? `${d}d ${h}h` : `${h}h`; };

  return (
    <AppShell>
      <TopBar title="Mission Control" />
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ═══════ Section 1: KPI Cards ═══════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 stagger">
          <KPICard icon={Package} label="项目" value={projects.length} color="var(--accent)" loaded={loaded} />
          <KPICard icon={Globe} label="域名" value={77} color="var(--purple)" loaded={loaded} />
          <KPICard icon={GitFork} label="GitHub" value={33} color="var(--text-primary)" loaded={loaded} />
          <KPICard icon={Cloud} label="Vercel" value={vercelCount} color="var(--text-secondary)" loaded={loaded} />
          <KPICard icon={Server} label="服务器" value={serverCount} color="var(--success)" loaded={loaded} />
          <KPICard icon={Layers} label="PM2" value={pm2.length} color="var(--accent)" loaded={loaded} />
          <KPICard icon={Shield} label="SSL" value={12} color="var(--success)" loaded={loaded} />
          <KPICard icon={Activity} label="健康度" value="99%" color="var(--success)" loaded={loaded} />
        </div>

        {/* ═══════ Section 2: Mission Control Summary ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* System Health */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="section-title">系统状态</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>全部正常</span>
            </div>
            <div className="space-y-3">
              <HealthRow label="GitHub API" status="online" latency="45ms" />
              <HealthRow label="Vercel API" status="online" latency="32ms" />
              <HealthRow label="Cloudflare API" status="online" latency="28ms" />
              <HealthRow label="腾讯云服务器" status="online" latency="12ms" />
              <HealthRow label="PM2 进程管理" status="online" latency="3ms" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="section-title">今日概览</span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="部署次数" value="3" trend="+2" positive />
              <MiniStat label="提交次数" value="12" trend="+5" positive />
              <MiniStat label="告警次数" value="0" trend="0" />
              <MiniStat label="证书过期" value="0" trend="0" />
            </div>
          </div>

          {/* Server Resources */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="section-title">服务器资源</span>
              <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{sysStats?.hostname || '—'}</span>
            </div>
            {sysStats && (
              <div className="space-y-3">
                <ResourceBar label="CPU" value={sysStats.cpu.loadAvg[0]} max={sysStats.cpu.cores} unit="" color="var(--accent)" />
                <ResourceBar label="内存" value={sysStats.memory.used} max={sysStats.memory.total} unit={fmtBytes} color="var(--purple)" />
                <ResourceBar label="磁盘" value={sysStats.disk.used} max={sysStats.disk.total} unit={fmtBytes} color="var(--warning)" />
                <div className="flex items-center justify-between text-[11px] pt-1" style={{ color: 'var(--text-muted)' }}>
                  <span>Uptime: {fmtUptime(sysStats.uptime)}</span>
                  <span>{sysStats.cpu.cores} cores · {sysStats.arch}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════ Section 3: Infrastructure Topology ═══════ */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">基础设施拓扑</h3>
          </div>
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
              {/* GitHub */}
              <TopologyNode title="GitHub" count={33} subtitle="仓库" color="var(--text-primary)" items={
                projects.filter((p: any) => p.github_repo).slice(0, 4).map((p: any) => p.github_repo)
              } />
              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-[1px]" style={{ background: 'var(--border)' }} />
                  <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>CI/CD</div>
                </div>
              </div>
              {/* Vercel + Server */}
              <div className="space-y-3">
                <TopologyNode title="▲ Vercel" count={vercelCount} subtitle="项目" color="var(--text-primary)" compact />
                <TopologyNode title="🖥 服务器" count={serverCount} subtitle="PM2" color="var(--success)" compact />
              </div>
              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-[1px]" style={{ background: 'var(--border)' }} />
                  <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>DNS</div>
                </div>
              </div>
              {/* Cloudflare */}
              <TopologyNode title="☁ Cloudflare" count={77} subtitle="DNS 记录" color="var(--warning)" items={[
                'allapple.top (68)', 'vios.top (9)', '20+ CNAME → Vercel', '12+ A → 服务器'
              ]} />
            </div>
          </div>
        </div>

        {/* ═══════ Section 4: Projects Grid ═══════ */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">项目中心</h3>
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>查看全部 →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 stagger">
            {projects.slice(0, 6).map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* ═══════ Section 5: Server Monitoring ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {/* PM2 Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">PM2 进程管理</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>{serverCount}/{pm2.length} 在线</span>
            </div>
            <div className="glass-card divide-y" style={{ borderColor: 'var(--border)' }}>
              {pm2.map((s: any) => (
                <PM2Row key={s.name} service={s} />
              ))}
              {pm2.length === 0 && <div className="p-8 text-center text-[12px]" style={{ color: 'var(--text-muted)' }}>暂无 PM2 数据</div>}
            </div>
          </div>

          {/* Recent Deployments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">最近部署</h3>
              <button className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}>查看全部 →</button>
            </div>
            <div className="glass-card divide-y" style={{ borderColor: 'var(--border)' }}>
              {projects.filter((p: any) => p.deploy_target !== 'server').slice(0, 6).map((p: any, i: number) => (
                <DeployRow key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ Section 6: Domain & DNS ═══════ */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">域名 & DNS</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>allapple.top</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>68 records</span>
              </div>
              <div className="space-y-1.5">
                {['aios.allapple.top → A → 43.167.213.143', 'enxx.allapple.top → CNAME → vercel-dns', 'chat.allapple.top → A → 43.167.213.143'].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    {r}
                  </div>
                ))}
                <div className="text-[10px] px-3" style={{ color: 'var(--text-muted)' }}>+65 more records...</div>
              </div>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4" style={{ color: 'var(--success)' }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>vios.top</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>9 records</span>
              </div>
              <div className="space-y-1.5">
                {['aios.vios.top → A → 43.167.213.143', 'game.vios.top → A → 43.167.213.143', 'dashboard.vios.top → A → 76.76.21.21'].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--success)' }} />
                    {r}
                  </div>
                ))}
                <div className="text-[10px] px-3" style={{ color: 'var(--text-muted)' }}>+6 more records...</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Section 7: Event Stream ═══════ */}
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">实时事件流</h3>
          </div>
          <div className="glass-card p-4 space-y-0.5">
            {[
              { time: '23:41', type: 'success', icon: CheckCircle2, text: 'dashboard 重新部署成功', tag: 'PM2' },
              { time: '23:38', type: 'success', icon: Rocket, text: 'Everett 运维中心 v1.0 构建完成', tag: 'Build' },
              { time: '23:33', type: 'info', icon: GitFork, text: 'xiaopengsvip/allapple-dashboard pushed to main', tag: 'GitHub' },
              { time: '23:27', type: 'success', icon: CheckCircle2, text: 'PM2 dashboard 进程启动成功', tag: 'PM2' },
              { time: '23:22', type: 'warning', icon: AlertTriangle, text: '端口 3400 被占用，自动清理完成', tag: 'Server' },
            ].map((evt, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200" style={{ background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-[10px] font-mono w-10 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{evt.time}</span>
                <evt.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: evt.type === 'success' ? 'var(--success)' : evt.type === 'warning' ? 'var(--warning)' : 'var(--accent)' }} />
                <span className="flex-1 text-[12px]" style={{ color: 'var(--text-secondary)' }}>{evt.text}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{evt.tag}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}

/* ═══════ Shared Components ═══════ */

function KPICard({ icon: Icon, label, value, color, loaded }: {
  icon: any; label: string; value: number | string; color: string; loaded: boolean;
}) {
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className={`metric-value ${loaded ? 'animate-count-up' : ''}`} style={{ color: 'var(--text-primary)' }}>
        {loaded ? value : '—'}
      </div>
    </div>
  );
}

function HealthRow({ label, status, latency }: { label: string; status: string; latency: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div className={`status-dot ${status}`} />
        <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{latency}</span>
    </div>
  );
}

function MiniStat({ label, value, trend, positive }: { label: string; value: string; trend: string; positive?: boolean }) {
  return (
    <div className="p-3 rounded-[10px]" style={{ background: 'var(--bg-card)' }}>
      <div className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-[22px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</span>
        {trend !== '0' && (
          <span className="flex items-center gap-0.5 text-[10px] font-medium mb-0.5" style={{ color: positive ? 'var(--success)' : 'var(--text-muted)' }}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : null}{trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ResourceBar({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: any; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const display = typeof unit === 'function' ? unit(value) : value.toFixed(2);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>{display} ({pct}%)</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function TopologyNode({ title, count, subtitle, color, items, compact }: {
  title: string; count: number; subtitle: string; color: string; items?: string[]; compact?: boolean;
}) {
  return (
    <div className="p-4 rounded-[14px] transition-all duration-200" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <span className="text-[11px] font-bold" style={{ color }}>{count}</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
      </div>
      {items && (
        <div className="space-y-1 mt-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] px-2 py-1 rounded-md" style={{ background: 'var(--bg-root)', color: 'var(--text-secondary)' }}>
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project: p }: { project: any }) {
  return (
    <div className="glass-card p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[13px] font-bold" style={{ background: `${p.color}18`, color: p.color }}>
            {p.name[0]}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.category}</div>
          </div>
        </div>
        <div className={`status-dot ${p.status === 'active' ? 'online' : p.status === 'developing' ? 'warning' : 'offline'}`} />
      </div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {p.deploy_target && (
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {p.deploy_target === 'vercel' ? '▲ Vercel' : p.deploy_target === 'server' ? '🖥 Server' : '🔗 Both'}
          </span>
        )}
        {p.github_repo && (
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {p.github_repo}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        {p.domain ? (
          <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
            className="text-[11px] font-medium flex items-center gap-1 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {p.domain} <ExternalLink className="w-3 h-3" />
          </a>
        ) : <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>—</span>}
      </div>
    </div>
  );
}

function PM2Row({ service: s }: { service: any }) {
  const isOnline = s.status === 'online';
  const mem = s.memory ? `${Math.round(s.memory / 1024 / 1024)} MB` : '—';
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 transition-all duration-200"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className={`status-dot ${isOnline ? 'online' : 'error'}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
        <div className="text-[11px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
          PID {s.pid} · {mem} · CPU {s.cpu || 0}%
        </div>
      </div>
      <div className="flex gap-0.5">
        <button className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--success)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        ><Play className="w-3.5 h-3.5" /></button>
        <button className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        ><FileText className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

function DeployRow({ project: p, index }: { project: any; index: number }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 transition-all duration-200"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: `${p.color}18`, color: p.color }}>
        {p.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.domain}</div>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>成功</span>
      {p.domain && (
        <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}
          className="p-1 rounded-md transition-colors hover:text-[var(--text-secondary)]"
        ><ExternalLink className="w-3 h-3" /></a>
      )}
    </div>
  );
}
